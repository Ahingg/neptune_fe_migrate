import { useState, useEffect } from 'react';
import type { GlobalContestResponse } from '../types/contest';
import { getAllGlobalContestsApi } from '../api/contest';
interface UseGlobalContestsResult {
    contests: GlobalContestResponse[];
    loading: boolean;
    error: string | null;
}

export const useGlobalContests = (): UseGlobalContestsResult => {
    const [contests, setContests] = useState<GlobalContestResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                setLoading(true);
                const data = await getAllGlobalContestsApi();
                setContests(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch global contests:', err);
                setError('Could not load global contests.');
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
    }, []); // Fetch only once on mount

    return { contests, loading, error };
};
