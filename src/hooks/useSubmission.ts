import { useState, useEffect, useCallback, useRef } from 'react';
import { useAtom } from 'jotai';
import { submissionHistoryCacheAtom } from '../store/submission';
import { useSubmissionWebSocket } from './useWebsocket';
import type { Case } from '../types/case';
import type { SubmissionHistoryItem, SubmitCodeResponse } from '../types/submission';
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
 * Manages the code submission process and updates the global submission
 * history cache in real-time via WebSockets.
 * @param contestId The ID of the current contest, used as a key for caching.
 * @param cases The list of cases in the contest, used to look up case details.
 */
export const useSubmission = (
    contestId?: string,
    cases: Case[] = []
): UseSubmissionResult => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [latestSubmissionId, setLatestSubmissionId] = useState<string | null>(
        null
    );
    const [_, setCache] = useAtom(submissionHistoryCacheAtom);

    // Ref to temporarily store the language ID of the current submission
    const languageIdRef = useRef<number>(0);

    const {
        latestUpdate,
        isConnected,
        error: judgingError,
    } = useSubmissionWebSocket(latestSubmissionId);

    const submit = useCallback(async (formData: FormData) => {
        setIsSubmitting(true);
        setSubmissionError(null);
        setLatestSubmissionId(null);

        // Store the language ID before sending the request
        languageIdRef.current = Number(formData.get('language_id'));

        try {
            const response: SubmitCodeResponse = await submitCodeApi(formData);
            setLatestSubmissionId(response.submission_id);
        } catch (err: any) {
            console.error('Submission API error:', err);
            setSubmissionError(
                err.response?.data?.error || 'Failed to submit code.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // This effect runs whenever a new WebSocket message arrives
    useEffect(() => {
        if (latestUpdate && contestId) {
            const { submission_id, final_status, score } = latestUpdate;

            setCache((prevCache) => {
                const newCache = { ...prevCache };
                const contestHistory = newCache[contestId]
                    ? [...newCache[contestId]]
                    : [];
                const existingSubmissionIndex = contestHistory.findIndex(
                    (s) => s.submission_id === submission_id
                );

                if (existingSubmissionIndex !== -1) {
                    // If submission exists, just update its status and score
                    contestHistory[existingSubmissionIndex] = {
                        ...contestHistory[existingSubmissionIndex],
                        status,
                        score,
                    };
                } else {
                    // If it's a new submission, create a full history item
                    const submittedCase = cases.find((c) => c.case_id === latestUpdate.case_id);
                    const newHistoryItem: SubmissionHistoryItem = {
                        submission_id,
                        contest_id: contestId,
                        case_id: submittedCase?.case_id || '',
                        case_code: submittedCase?.problem_code || '',
                        status: final_status,
                        score,
                        submit_time: new Date().toISOString(),
                        language_id: languageIdRef.current,
                    };
                    // Add to the beginning of the array to show it first
                    contestHistory.unshift(newHistoryItem);
                }

                newCache[contestId] = contestHistory;
                return newCache;
            });
        }
    }, [latestUpdate, contestId, setCache, cases]);

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
