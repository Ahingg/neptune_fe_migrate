import { useCallback, useEffect, useState } from "react";
import * as caseApi from "../api/case";
import type { Case } from "../types/case";

function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await caseApi.getCases();
      setCases(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch cases");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCase = useCallback(async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const newCase = await caseApi.createCase(formData);
      setCases((prev) => [...prev, newCase]);
      return newCase;
    } catch (err: any) {
      setError(err.message || "Failed to create case");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCase = useCallback(
    async (caseId: string, data: Partial<Case>) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await caseApi.updateCase(caseId, data);
        setCases((prev) =>
          prev.map((c) => (c.case_id === caseId ? updated : c))
        );
        return updated;
      } catch (err: any) {
        setError(err.message || "Failed to update case");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCase = useCallback(async (caseId: string) => {
    setLoading(true);
    setError(null);
    try {
      await caseApi.deleteCase(caseId);
      setCases((prev) => prev.filter((c) => c.case_id !== caseId));
    } catch (err: any) {
      setError(err.message || "Failed to delete case");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return {
    cases,
    loading,
    error,
    fetchCases,
    createCase,
    updateCase,
    deleteCase,
    setCases, // Expose for advanced use
  };
}

export default useCases;
