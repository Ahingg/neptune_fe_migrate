import { useState, useCallback } from 'react';
import { useSubmissionWebSocket } from './useWebsocket';
import { submitCodeApi } from '../api/submission';

interface UseSubmissionResult {
    submit: (formData: FormData) => Promise<void>;
    isSubmitting: boolean;
    submissionError: string | null;
    latestUpdate: WebSocketSubmissionUpdate | null;
    isJudging: boolean;
    judgingError: Event | null;
}

/**
 * Manages the code submission process and real-time result updates via WebSocket.
 */
export const useSubmission = (): UseSubmissionResult => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [latestSubmissionId, setLatestSubmissionId] = useState<string | null>(
        null
    );

    // This internal hook listens for WebSocket updates whenever latestSubmissionId changes.
    const {
        latestUpdate,
        isConnected,
        error: judgingError,
    } = useSubmissionWebSocket(latestSubmissionId);

    const submit = useCallback(async (formData: FormData) => {
        setIsSubmitting(true);
        setSubmissionError(null);
        setLatestSubmissionId(null); // Reset to trigger WS hook correctly

        try {
            const response: SubmitCodeResponse = await submitCodeApi(formData);
            setLatestSubmissionId(response.submission_id); // This triggers the WebSocket connection
        } catch (err: any) {
            console.error('Submission API error:', err);
            setSubmissionError(
                err.response?.data?.error || 'Failed to submit code.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // We consider it "judging" if the submission is done and we are connected to the WebSocket.
    const isJudging = !isSubmitting && isConnected;

    return {
        submit,
        isSubmitting,
        submissionError,
        latestUpdate,
        isJudging,
        judgingError,
    };
};
