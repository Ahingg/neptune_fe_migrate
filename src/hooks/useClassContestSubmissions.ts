import { useState, useEffect } from 'react';
import type { SubmissionHistoryItem } from '../types/submission';
import { getSubmissionsForContestApi } from '../api/submission';

export const useClassContestSubmissions = (
    classId?: string,
    contestId?: string
) => {
    const [submissions, setSubmissions] = useState<SubmissionHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!classId || !contestId) {
            setSubmissions([]);
            return;
        }

        const fetchSubmissions = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getSubmissionsForContestApi(
                    contestId,
                    classId
                );
                setSubmissions(data);
            } catch (e: any) {
                setError(
                    e.response?.data?.error || 'Failed to fetch submissions'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [classId, contestId]);

    return { submissions, loading, error };
};
