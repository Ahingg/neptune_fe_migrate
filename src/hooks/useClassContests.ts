import { useEffect, useState } from "react";
import { getContestsForClassApi } from "../api/class";
import type { ClassContestAssignment } from "../types/class";

const useClassContests = (classId: string | undefined) => {
  const [contests, setContests] = useState<ClassContestAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) {
      setContests([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getContestsForClassApi(classId)
      .then(setContests)
      .catch((e) => setError(e.message || "Failed to fetch contests"))
      .finally(() => setLoading(false));
  }, [classId]);
  

  return { contests, loading, error };
};

export default useClassContests;
