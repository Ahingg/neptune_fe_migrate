import { useCallback, useEffect, useState } from "react";
import { getAllClassesBySemesterIdApi } from "../api/class";
import { useSemester } from "./useSemester";
import type { Class } from "../types/class";

// Hardcoded course IDs from backend constants
const COURSE_IDS = [
  {
    id: "09a7b352-1f11-ec11-90f0-d8d385fce79e",
    name: "Algorithm and Programming 1 (COMP6047001)",
  },
  {
    id: "c4abc69e-e63b-ee11-ae31-d8d385fce79e",
    name: "Algorithm and Programming 2 (COMP6878051)",
  },
];

export function useClasses(courseId = COURSE_IDS[0].id) {
  const { semester, loading: semesterLoading } = useSemester();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    if (!semester || !courseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAllClassesBySemesterIdApi(
        semester.semester_id,
        courseId
      );
      setClasses(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  }, [semester, courseId]);

  useEffect(() => {
    if (semester && !semesterLoading && courseId) {
      fetchClasses();
    }
  }, [semester, semesterLoading, courseId, fetchClasses]);

  return {
    classes,
    loading: loading || semesterLoading,
    error,
    fetchClasses,
    setClasses,
    courseId,
    courseOptions: COURSE_IDS,
  };
}
