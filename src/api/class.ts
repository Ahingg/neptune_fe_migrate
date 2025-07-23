import axiosClient from "./axiosClient";
import type { Class, ClassContestAssignment } from "../types/class";

/**
 * Fetches details of a specific class, including its students and contests.
 * @param classId The ID of the class.
 */
export const getClassByIdApi = async (classId: string): Promise<Class> => {
  const response = await axiosClient.get<Class>(`/api/class-detail?class_transaction_id=${classId}`);
  return response.data;
};

/**
 * Fetches all contests assigned to a specific class.
 * @param classTransactionId The ID of the class.
 */
export const getContestsForClassApi = async (
  classTransactionId: string
): Promise<ClassContestAssignment[]> => {
  const response = await axiosClient.get<ClassContestAssignment[]>(
    `/api/classes/${classTransactionId}/contests`
  );
  return response.data;
};

// Fetch all classes by semesterId and courseId using the correct backend endpoint
export const getAllClassesBySemesterIdApi = async (
  semesterId: string,
  courseId: string
): Promise<Class[]> => {
  const response = await axiosClient.get<Class[]>(
    `/api/classes?semester_id=${semesterId}&course_id=${courseId}`
  );
  return response.data;
};

/**
 * Fetches all class contest assignments (class contests) for admin.
 */
export const getAllClassContestsApi = async (): Promise<
  ClassContestAssignment[]
> => {
  const response = await axiosClient.get<ClassContestAssignment[]>(
    "/api/class-contests"
  );
  return response.data;
};
