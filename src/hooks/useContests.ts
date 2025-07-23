import { useCallback, useEffect, useState } from "react";
import * as contestApi from "../api/contest";
import type { Contest } from "../types/contest";

export function useContests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contestApi.getContests();
      setContests(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch contests");
    } finally {
      setLoading(false);
    }
  }, []);

  const createContest = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const newContest = await contestApi.createContest(data);
      setContests((prev) => [...prev, newContest]);
      return newContest;
    } catch (err: any) {
      setError(err.message || "Failed to create contest");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContest = useCallback(async (contestId: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await contestApi.updateContest(contestId, data);
      setContests((prev) =>
        prev.map((c) => (c.id === contestId ? updated : c))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update contest");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteContest = useCallback(async (contestId: string) => {
    setLoading(true);
    setError(null);
    try {
      await contestApi.deleteContest(contestId);
      setContests((prev) => prev.filter((c) => c.id !== contestId));
    } catch (err: any) {
      setError(err.message || "Failed to delete contest");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  return {
    contests,
    loading,
    error,
    fetchContests,
    createContest,
    updateContest,
    deleteContest,
    setContests, // Expose for advanced use
  };
}
