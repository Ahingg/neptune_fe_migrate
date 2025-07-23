import { useCallback, useEffect, useState } from "react";
import { getAllClassContestsApi } from "../api/class";
import type { ClassContestAssignment } from "../types/class";

export function useClassContests() {
  const [classContests, setClassContests] = useState<ClassContestAssignment[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClassContests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllClassContestsApi();
      setClassContests(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch class contests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassContests();
  }, [fetchClassContests]);

  return {
    classContests,
    loading,
    error,
    fetchClassContests,
    setClassContests,
  };
}
