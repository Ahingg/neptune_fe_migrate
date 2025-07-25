import { useState } from 'react';

// This hook centralizes loading, error, and feedback message state for admin pages.
export const useAdminPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleApiCall = async <T>(apiCall: () => Promise<T>, successMessage: string) => {
        setLoading(true);
        setError(null);
        setFeedback(null);
        try {
            await apiCall();
            setFeedback(successMessage);
        } catch (err: any) {
            const backendError = err.response?.data?.error || err.message || 'An unknown error occurred.';
            setError(backendError);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, feedback, handleApiCall, setError, setFeedback };
};