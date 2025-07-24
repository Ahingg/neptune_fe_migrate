import axiosClient from "./axiosClient";
import type { Contest, GlobalContestDetailResponse, GlobalContestResponse } from "../types/contest";
import type { Case } from "../types/case";
import type { ClassContestAssignment } from "../types/class";

/**
 * Fetches all contests.
 */
export const getContests = async (): Promise<Contest[]> => {
  const response = await axiosClient.get<Contest[]>(`/api/contests`);
  return response.data;
};

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
  return response.data;
};

/**
 * Creates a new contest.
 */
export const createContest = async (data: any): Promise<Contest> => {
  const response = await axiosClient.post("/admin/contests", data);
  return response.data;
};

/**
 * Updates a contest.
 */
export const updateContest = async (
  contestId: string,
  data: any
): Promise<Contest> => {
  const response = await axiosClient.put(`/admin/contests/${contestId}`, data);
  return response.data;
};

/**
 * Deletes a contest.
 */
export const deleteContest = async (contestId: string): Promise<void> => {
  await axiosClient.delete(`/admin/contests/${contestId}`);
};

/**
 * Assigns cases to a contest.
 */
export const assignCasesToContest = async (
  contestId: string,
  caseIds: string[]
): Promise<void> => {
  await axiosClient.post(`/admin/contests/${contestId}/cases`, {
    problems: caseIds.map((id) => ({ case_id: id })),
  });
};

/**
 * Assigns a contest to a class.
 */
export const assignContestToClass = async (
  classTransactionId: string,
  data: { contest_id: string; start_time: string; end_time: string }
): Promise<void> => {
  await axiosClient.post(
    `/admin/classes/${classTransactionId}/assign-contest`,
    data
  );
};

/**
 * Fetches class assignments for a specific contest.
 */
export const getClassAssignmentsForContest = async (
  contestId: string
): Promise<ClassContestAssignment[]> => {
  const response = await axiosClient.get<any>(`/api/contests/${contestId}`);
  return response.data.class_contests || [];
};

export const getCasesForContestApi = async (contestId: string) => {
  const response = await axiosClient.get(`/api/contests/${contestId}`);
  return response.data.cases || [];
};

/**
 * Fetches all global contests without their detailed cases.
 */
export const getAllGlobalContestsApi = async (): Promise<GlobalContestResponse[]> => {
  const response = await axiosClient.get<GlobalContestResponse[]>('/api/contests/global');
  return response.data;
};

/**
 * Fetches the details of a single global contest, including its cases.
 * @param contestId The ID of the global contest.
 */
export const getGlobalContestDetailApi = async (contestId: string): Promise<GlobalContestDetailResponse> => {
  const response = await axiosClient.get<GlobalContestDetailResponse>(`/api/contests/global-detail?id=${contestId}`);
  return response.data;
};
