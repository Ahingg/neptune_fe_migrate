import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { leaderboardRefreshTriggerAtom } from "../store/leaderboard";
import { getLeaderboard } from "../api/leaderboard";
import type { LeaderboardData } from "../types/leaderboard";

interface UseLeaderboardDataResult {
  leaderboardData: LeaderboardData | null;
  loading: boolean;
  error: string | null;
}

export const useLeaderboardData = (
  contestId?: string,
  classTransactionId?: string
): UseLeaderboardDataResult => {
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false); // Default to false
  const [error, setError] = useState<string | null>(null);
  const refreshTrigger = useAtomValue(leaderboardRefreshTriggerAtom);

  useEffect(() => {
    // If no contestId is provided, do not fetch and do not set an error.
    if (!contestId) {
      setLeaderboardData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeaderboard(contestId, classTransactionId);
        setLeaderboardData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [contestId, classTransactionId, refreshTrigger]);

  return { leaderboardData, loading, error };
};
