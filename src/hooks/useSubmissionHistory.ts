import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { submissionHistoryCacheAtom } from "../store/submission";
import type { SubmissionHistoryItem } from "../types/submission";
import { getSubmissionsForContestApi } from "../api/submission";
interface UseSubmissionHistoryResult {
  submissions: SubmissionHistoryItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetches and manages state for the user's submission history in a contest,
 * with global caching via Jotai to prevent redundant API calls.
 * @param contestId The ID of the contest.
 * @param classId Optional class ID.
 */
export const useSubmissionHistory = (
  contestId?: string,
  classId?: string
): UseSubmissionHistoryResult => {
  const [cache, setCache] = useAtom(submissionHistoryCacheAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contestId) {
      setLoading(false);
      return;
    }

    // If data is already in the cache, use it and don't fetch again.
    if (cache[contestId]) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getSubmissionsForContestApi(contestId, classId);
        // Update the global cache with the new data.
        setCache((prevCache) => ({
          ...prevCache,
          [contestId]: data,
        }));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch submission history:", err);
        setError("Could not load submission history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [contestId, classId, setCache]);

  const submissions = cache[contestId || ""] || [];

  return { submissions, loading, error };
};
