import type {
  SubmissionHistoryItem,
  SubmitCodeResponse,
} from "../types/submission";
import axiosClient from "./axiosClient";

// Function for submitting code as multipart/form-data (handles both string and file)
export const submitCodeApi = async (
  formData: FormData // Always expects FormData
): Promise<SubmitCodeResponse> => {
  const response = await axiosClient.post<SubmitCodeResponse>(
    "/api/submissions",
    formData,
    {
      headers: {
        // Axios will often set this automatically for FormData, but explicit is fine
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Fetch all submissions (for frontend filtering workaround)
export const getAllSubmissions = async () => {
  const response = await axiosClient.get("/api/submissions");
  return response.data;
};

/**
 * Fetches the user's submission history for a specific contest.
 * @param contestId The ID of the contest.
 * @param classTransactionId Optional class ID for context.
 * @returns A promise that resolves to an array of submission history items.
 */
export const getSubmissionsForContestApi = async (
  contestId: string,
  classTransactionId?: string
): Promise<SubmissionHistoryItem[]> => {
  let url = `/api/submission/all/${contestId}`;

  // Conditionally add the class transaction ID as a query parameter
  if (classTransactionId) {
    url += `?class_transaction_id=${classTransactionId}`;
  }

  const response = await axiosClient.get<SubmissionHistoryItem[]>(url);
  return response.data || [];
};
