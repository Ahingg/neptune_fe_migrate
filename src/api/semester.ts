import type { Semester } from '../types/semester';
import axiosClient from './axiosClient';

/**
 * Fetches the current active semester.
 */
export const getCurrentSemesterApi = async (): Promise<Semester> => {
    const response = await axiosClient.get<Semester>('/api/semesters/current');
    return response.data;
};

/**
 * Fetches all semesters. (Mocked as backend endpoint might not be detailed yet)
 */
export const getAllSemestersApi = async (): Promise<Semester[]> => {
    const response = await axiosClient.get<Semester[]>('/api/semesters');
    return response.data;
};
