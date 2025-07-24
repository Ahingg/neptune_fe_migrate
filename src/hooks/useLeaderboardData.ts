import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { leaderboardRefreshTriggerAtom } from '../store/leaderboard';
import type { LeaderboardData } from '../types/leaderboard';
import { getLeaderboard } from '../api/leaderboard';
interface UseLeaderboardDataResult {
    leaderboardData: LeaderboardData | null;
    loading: boolean;
    error: string | null;
}

/**
 * Fetches and manages state for contest leaderboard data.
 * This hook is now reactive to a global refresh trigger.
 * @param contestId The ID of the contest.
 * @param classTransactionId Optional ID for class-specific leaderboards.
 */
export const useLeaderboardData = (
    contestId?: string,
    classTransactionId?: string
): UseLeaderboardDataResult => {
    const [leaderboardData, setLeaderboardData] =
        useState<LeaderboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Listen to the refresh trigger atom.
    const refreshTrigger = useAtomValue(leaderboardRefreshTriggerAtom);

    useEffect(() => {
        if (!contestId) {
            setLoading(false);
            setError('Contest ID is required to fetch leaderboard.');
            return;
        }

        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const data = await getLeaderboard(
                    contestId,
                    classTransactionId
                );
                setLeaderboardData(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch leaderboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [contestId, classTransactionId, refreshTrigger]); // Add refreshTrigger to dependency array

    return { leaderboardData, loading, error };
};
