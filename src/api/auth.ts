// src/api/auth.ts
import type { LoginRequest, LoginResponse, UserMeResponse } from '../types/auth';
import axiosClient from './axiosClient';

/**
 * Sends login credentials to the backend.
 * Backend sets HTTP-only cookie; no JWT token is returned in the response body.
 */
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>('/auth/login', data);
    // console.log(response);
    return response.data;
};

/**
 * Sends a logout request to the backend.
 * Backend clears the HTTP-only cookie.
 */
export const logoutApi = async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
};

/**
 * Fetches the current authenticated user's data from the backend.
 * Relies on the HTTP-only JWT cookie being sent by the browser.
 */
export const getMeApi = async (): Promise<UserMeResponse> => {
    const response = await axiosClient.get<UserMeResponse>('/auth/me');
    return response.data;
};
