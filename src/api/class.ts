import axiosClient from "./axiosClient";
import type { Class, ClassContestAssignment } from "../types/class";

/**
 * Fetches details of a specific class, including its students and contests.
 * @param classId The ID of the class.
 */
export const getClassByIdApi = async (classId: string) => {
  const res = await axiosClient.get(
    `/api/class-detail?class_transaction_id=${classId}`
  );
  return res.data;
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
  courseId?: string
): Promise<Class[]> => {
  let url = `/api/classes?semester_id=${semesterId}`;
  if (courseId) url += `&course_id=${courseId}`;
  const response = await axiosClient.get<Class[]>(url);
  return response.data;
};
