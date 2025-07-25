
import { useState, useEffect } from 'react';
import { getClassByIdApi, getContestsForClassApi } from '../api/class';
import type { Class, ClassContestAssignment } from '../types/class';
import type { UserProfile } from '../types/auth';

interface UseClassDetailsResult {
  classData: Class | null;
  contests: ClassContestAssignment[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetches all details for a specific class, including assigned contests.
 * @param classId The ID of the class.
 */
export const useClassDetails = (
  classId: string | undefined
): UseClassDetailsResult => {
  const [classData, setClassData] = useState<Class | null>(null);
  const [contests, setContests] = useState<ClassContestAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) {
      setLoading(false);
      setError("No Class ID provided.");
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Fetch class details and contests in parallel for efficiency
        const [classResult, contestsResult] = await Promise.all([
          getClassByIdApi(classId),
          getContestsForClassApi(classId),
        ]);

        setClassData(classResult);
        if (classResult && Array.isArray(classResult.students)) {
          classResult.students.sort((a: UserProfile, b: UserProfile) => a.name.localeCompare(b.name));
        }
        setContests(contestsResult);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch class details:", err);
        setError(err.response?.data?.error || "Failed to load class data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [classId]); // Refetch if the classId changes

  return { classData, contests, loading, error };
};

export default useClassDetails;
