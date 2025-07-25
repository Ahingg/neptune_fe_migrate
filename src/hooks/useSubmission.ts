import { useState, useEffect, useCallback, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { submissionHistoryCacheAtom } from '../store/submission';
import { leaderboardRefreshTriggerAtom } from '../store/leaderboard';
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

    // Get the setter function for the leaderboard refresh trigger.
    const triggerLeaderboardRefresh = useSetAtom(leaderboardRefreshTriggerAtom);

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

    useEffect(() => {
        if (latestUpdate && contestId) {
            const { submission_id, score, case_id } = latestUpdate;

            // Update submission history cache
            setCache((prevCache) => {
                const newCache = { ...prevCache };
                const contestHistory = newCache[contestId]
                    ? [...newCache[contestId]]
                    : [];
                const existingSubmissionIndex = contestHistory.findIndex(
                    (s) => s.submission_id === submission_id
                );

                if (existingSubmissionIndex !== -1) {
                    contestHistory[existingSubmissionIndex] = {
                        ...contestHistory[existingSubmissionIndex],
                        status: latestUpdate.status,
                        score,
                    };
                } else {
                    const submittedCase = cases.find((c: Case) => c.case_id === case_id);
                    const newHistoryItem: SubmissionHistoryItem = {
                        name: null,
                        username: null,
                        user_id: null,
                        submission_id,
                        contest_id: contestId,
                        case_id,
                        case_code: submittedCase?.problem_code || 'N/A',
                        status: latestUpdate.status,
                        score,
                        submit_time: new Date().toISOString(),
                        language_id: languageIdRef.current,
                    };
                    contestHistory.unshift(newHistoryItem);
                }

                newCache[contestId] = contestHistory;
                return newCache;
            });

            // If the verdict is final, trigger a leaderboard refresh.
            if (latestUpdate.status !== 'Judging') {
                triggerLeaderboardRefresh((c) => c + 1);
            }
        }
    }, [latestUpdate, contestId, setCache, cases, triggerLeaderboardRefresh]);

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
