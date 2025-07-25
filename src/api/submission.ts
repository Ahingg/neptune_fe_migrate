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
  let urlBase = `/api/submission/`;
  if (classTransactionId) {
    urlBase += `all/${contestId}`;
    urlBase += `?class_transaction_id=${classTransactionId}`;
  }
  else {
    urlBase += `${contestId}`;
  }
  const response = await axiosClient.get<SubmissionHistoryItem[]>(urlBase);
  return response.data || [];
};

/**
 * Fetches the source code for a single submission.
 * @param submissionId The ID of the submission.
 * @returns A promise that resolves to the source code as a string.
 */
export const getSubmissionCodeApi = async (
    submissionId: string
): Promise<string> => {
    const response = await axiosClient.get(
        `/api/submissions/${submissionId}/code`,
        { responseType: 'text' }
    );
    return response.data;
};

export const downloadSubmissionCodeApi = async (
    submissionId: string
): Promise<void> => {
    const response = await axiosClient.get(
        `/api/submissions/${submissionId}/download`,
        {
            responseType: 'blob', // important: handle binary data
        }
    );

    const blob = new Blob([response.data], { type: 'application/zip' });

    // Try to extract filename from Content-Disposition header
    const disposition = response.headers['content-disposition'];
    const match = disposition?.match(/filename="(.+)"/);
    console.log('Content-Disposition:', response);
    const filename = match?.[1] ?? `submission_${submissionId}.zip`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};