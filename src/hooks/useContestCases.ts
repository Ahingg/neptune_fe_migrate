import { useEffect, useState } from "react";
import { getCasesForContestApi } from "../api/contest";
import type { Case } from "../types/case";

const useContestCases = (contestId: string | undefined) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contestId) {
      setCases([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getCasesForContestApi(contestId)
      .then(setCases)
      .catch((e) => setError(e.message || "Failed to fetch cases"))
      .finally(() => setLoading(false));
  }, [contestId]);

  return { cases, loading, error };
};

export default useContestCases;
