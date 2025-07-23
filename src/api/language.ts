import axiosClient from "./axiosClient";


export const getSupportedLanguagesApi = async (): Promise<LanguageInfo[]> => {
    const response = await axiosClient.get<LanguageInfo[]>('/api/languages'); // Assuming this endpoint
    return response.data;
};
