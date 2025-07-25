import type { LeaderboardData } from "../types/leaderboard";
import axiosClient from "./axiosClient";

/**
 * Fetches the leaderboard data for a specific contest.
 * @param contestId - The UUID of the contest.
 * @param classTransactionId - (Optional) The UUID for the class context.
 * @returns A promise that resolves to the leaderboard data.
 */
export const getLeaderboard = async (
  contestId: string,
  classTransactionId?: string
): Promise<LeaderboardData> => {
  // The backend endpoint will determine the final URL structure.
  // This is a likely implementation.
  let url = `/contests/${contestId}/leaderboard`;
  if (classTransactionId) {
    url = `/classes/${classTransactionId}${url}`;
  }

  let finalUrl = `/api${url}?`;

  const response = await axiosClient.get<LeaderboardData>(finalUrl);
  return response.data;
};
