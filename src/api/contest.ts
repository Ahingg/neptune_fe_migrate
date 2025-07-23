import axiosClient from "./axiosClient";

/**
 * Fetches details of a specific contest, including its assigned cases.
 * @param contestId The ID of the contest.
 */
export const getContestByIdApi = async (
    contestId: string
): Promise<Contest & { cases: Case[] }> => {
    const response = await axiosClient.get<Contest & { cases: Case[] }>(
        `/api/contests/${contestId}`
    );
    console.log('Contest details fetched:', response.data);
    return response.data;
};
