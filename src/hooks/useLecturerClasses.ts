import { useEffect, useState } from "react";
import { getAllClassesBySemesterIdApi, getClassByIdApi } from "../api/class";
import type { Class } from "../types/class";
import { getCurrentSemesterApi } from "../api/semester";
import { getMeApi } from "../api/auth";

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
        const allClasses = await getAllClassesBySemesterIdApi(
          semester.semester_id,
          "09a7b352-1f11-ec11-90f0-d8d385fce79e"
        );
        // Fetch class details for each class to get assistant information
        const details = await Promise.all(
          allClasses.map((cls) => getClassByIdApi(cls.class_transaction_id))
        );
        // Filter for classes where user is an assistant
        const filtered = details.filter((cls) =>
          (cls.assistants || []).some((a: any) => a.user_id === me.user.id)
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
