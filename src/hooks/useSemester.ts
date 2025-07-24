import { useState, useEffect } from 'react';
import { getCurrentSemesterApi } from '../api/semester';
import type { Semester } from '../types/semester';

interface UseSemesterResult {
    semester: Semester | null;
    loading: boolean;
    error: string | null;
}

/**
 * Fetches and manages the state for the current semester.
 */
export const useSemester = (): UseSemesterResult => {
    const [semester, setSemester] = useState<Semester | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSemester = async () => {
            try {
                setLoading(true);
                const semesterData = await getCurrentSemesterApi();
                setSemester(semesterData);
            } catch (err: any) {
                console.error('Failed to fetch current semester:', err);
                setError(
                    err.response?.data?.error || 'Failed to load semester data.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSemester();
    }, []); // Empty dependency array ensures this runs only once on mount

    return { semester, loading, error };
};
