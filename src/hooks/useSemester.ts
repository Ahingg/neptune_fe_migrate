import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { semestersCacheAtom } from '../store/semester';
import { getAllSemestersApi, getCurrentSemesterApi } from '../api/semester';

/**
 * A hook that provides a cached list of all semesters and the current semester.
 * Data is fetched only once and stored in a global Jotai atom.
 */
export const useSemesters = () => {
    const [cache, setCache] = useAtom(semestersCacheAtom);
    const { all: semesters, current: currentSemester } = cache;
    const loading = semesters.length === 0;

    useEffect(() => {
        // Only fetch if the cache is empty.
        if (semesters.length === 0) {
            const fetchAndCacheSemesters = async () => {
                try {
                    const [all, current] = await Promise.all([
                        getAllSemestersApi(),
                        getCurrentSemesterApi(),
                    ]);
                    setCache({ all, current });
                } catch (error) {
                    console.error(
                        'Failed to fetch and cache semesters:',
                        error
                    );
                }
            };
            fetchAndCacheSemesters();
        }
    }, [semesters.length, setCache]);

    return { semesters, currentSemester, loading };
};
