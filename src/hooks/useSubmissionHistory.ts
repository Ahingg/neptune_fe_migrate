import { useState, useEffect, useRef } from "react";
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
  const [error, setError] = useState<string | null>(null);

  // Use a ref to track which contest IDs have already been fetched in this session.
  const hasFetchedRef = useRef<Set<string>>(new Set());

  // The loading state is now simply whether the data for the current contestId exists in the cache.
  const loading = contestId ? cache[contestId] === undefined : false;

  useEffect(() => {
    // Only proceed if we have a contestId and we haven't fetched it before.
    if (contestId && !hasFetchedRef.current.has(contestId)) {
      const fetchHistory = async () => {
        // Mark this contestId as "fetched" immediately to prevent concurrent requests.
        hasFetchedRef.current.add(contestId);
        try {
          const data = await getSubmissionsForContestApi(contestId, classId);
          // Use the callback form to update the atom. This avoids needing `cache` in the dependency array.
          setCache((prevCache) => ({
            ...prevCache,
            [contestId]: data,
          }));
          setError(null);
        } catch (err) {
          console.error("Failed to fetch submission history:", err);
          setError("Could not load submission history.");
          // If the fetch fails, remove it from the set so it can be retried.
          hasFetchedRef.current.delete(contestId);
        }
      };

      fetchHistory();
    }
    // This effect should ONLY re-run if the contest or class ID changes.
    // `setCache` is stable and won't cause re-runs.
  }, [contestId, classId, setCache]);

  const submissions = cache[contestId || ''] || [];
  // console.log('Submission history for contest:', contestId, 'is', submissions);
  return { submissions, loading, error };
};
