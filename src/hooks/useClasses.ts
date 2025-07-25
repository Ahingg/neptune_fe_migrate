import { useCallback, useEffect, useState } from "react";
import { getAllClassesBySemesterIdApi } from "../api/class";
import { useSemesters } from "./useSemester";
import type { Class } from "../types/class";


export function useClasses(courseId?: string) {
  const { currentSemester, loading: semesterLoading } = useSemesters();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
      if (!currentSemester || !courseId) return;
      setLoading(true);
      setError(null);
      try {
          const data = await getAllClassesBySemesterIdApi(
              currentSemester.semester_id,
              courseId
          );
          setClasses(data);
      } catch (err: any) {
          setError(err.message || 'Failed to fetch classes');
      } finally {
          setLoading(false);
      }
  }, [currentSemester, courseId]);

  useEffect(() => {
    if (currentSemester && !semesterLoading && courseId) {
        fetchClasses();
    }
  }, [currentSemester, semesterLoading, courseId, fetchClasses]);

  return {
    classes,
    loading: loading || semesterLoading,
    error,
    fetchClasses,
    setClasses,
    courseId,
  };
}
