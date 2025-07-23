import { useEffect, useState } from "react";
import { getCurrentSemesterApi } from "../api/semester";
import { getAllClassesBySemesterIdApi } from "../api/class";
import { getMeApi } from "../api/auth";
import type { Class } from "../types/class";

const useLecturerClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const me = await getMeApi();
        setUserId(me.user.id);
        const semester = await getCurrentSemesterApi();
        // Call getAllClassesBySemesterIdApi with hardcoded courseId
        const allClasses = await getAllClassesBySemesterIdApi(
          semester.semester_id,
          "09a7b352-1f11-ec11-90f0-d8d385fce79e"
        );
        const filtered = allClasses.filter((cls) =>
          (cls.assistants || []).some((a) => a.user_id === me.user.id)
        );
        setClasses(filtered);
      } catch (e: any) {
        setError(e.message || "Failed to fetch classes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { classes, loading, error, userId };
};

export default useLecturerClasses;
