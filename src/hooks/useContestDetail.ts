import { useState, useEffect } from "react";
import type { Contest } from "../types/contest";
import type { Case } from "../types/case";
import { getContestByIdApi } from "../api/contest";
interface UseContestDetailsResult {
  contest: Contest | null;
  cases: Case[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetches details for a specific contest, including its cases.
 * @param contestId The ID of the contest to fetch.
 */
export const useContestDetails = (
    contestId: string | undefined
): UseContestDetailsResult => {
    const [contest, setContest] = useState<Contest | null>(null);
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!contestId) {
            setLoading(false);
            setError('No Contest ID provided.');
            return;
        }

        const fetchContest = async () => {
            try {
                setLoading(true);
                const contestData = await getContestByIdApi(contestId);
                setContest(contestData);
                setCases(contestData.cases || []);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch contest details:', err);
                setError(
                    err.response?.data?.error || 'Failed to load contest data.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchContest();
    }, [contestId]);
    return { contest, cases, loading, error };
};