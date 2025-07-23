import axiosClient from './axiosClient';

// Function for submitting code as multipart/form-data (handles both string and file)
export const submitCodeApi = async (
    formData: FormData // Always expects FormData
): Promise<SubmitCodeResponse> => {
    const response = await axiosClient.post<SubmitCodeResponse>(
        '/api/submissions',
        formData,
        {
            headers: {
                // Axios will often set this automatically for FormData, but explicit is fine
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};
