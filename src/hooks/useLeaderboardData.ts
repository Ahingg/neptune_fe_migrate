import { useState, useEffect } from 'react';
import type { LeaderboardData } from '../types/leaderboard';
import { getLeaderboard } from '../api/leaderboard';
interface UseLeaderboardDataResult {
    leaderboardData: LeaderboardData | null;
    loading: boolean;
    error: string | null;
}

/**
 * Fetches and manages state for contest leaderboard data.
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
    }, [contestId, classTransactionId]);

    return { leaderboardData, loading, error };
};
