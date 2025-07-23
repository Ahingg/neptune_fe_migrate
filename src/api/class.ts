import axiosClient from './axiosClient';

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

// later add get allClassBySemesterId for admin.
export const getAllClassesBySemesterIdApi = async (
    semesterId: string
): Promise<Class[]> => {
    const response = await axiosClient.get<Class[]>(
        `/api/semesters/${semesterId}/classes`
    );
    return response.data;
};
