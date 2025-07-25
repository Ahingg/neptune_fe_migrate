import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getAllClassesBySemesterIdApi, getClassByIdApi } from '../api/class';
import { useSemesters } from './useSemester';
import type { Class } from '../types/class';

const DEFAULT_COURSE_ID = '09a7b352-1f11-ec11-90f0-d8d385fce79e';

export const useLecturerClasses = () => {
    const {
        semesters,
        currentSemester,
        loading: semestersLoading,
    } = useSemesters();
    const { user } = useAuth();

    const [selectedSemester, setSelectedSemester] = useState<string>('');
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Effect to set the initial semester once the current semester is loaded from the cache.
    useEffect(() => {
        if (currentSemester && !selectedSemester) {
            setSelectedSemester(currentSemester.semester_id);
        }
    }, [currentSemester, selectedSemester]);

    // Effect to fetch the lecturer's classes for the selected semester.
    useEffect(() => {
        // Don't run if we don't have the necessary data yet.
        if (!selectedSemester || !user?.id) {
            return;
        }

        const fetchClasses = async () => {
            setLoading(true);
            
            setError(null);
            setClasses([]); // Clear previous classes

            try {
                const allClasses = await getAllClassesBySemesterIdApi(
                    selectedSemester,
                    DEFAULT_COURSE_ID
                );

                // This N+1 fetch pattern is inefficient, but we follow the existing logic.
                // A better backend would have an endpoint like /api/semesters/:id/my-classes
                const details = await Promise.all(
                    allClasses.map((cls) =>
                        getClassByIdApi(cls.class_transaction_id)
                    )
                );

                const filtered = details.filter((cls) =>
                    (cls.assistants || []).some(
                        (a: any) => a.user_id === user.id
                    )
                );

                setClasses(filtered);

                if (filtered.length === 0) {
                    setError(
                        'You are not assigned as an assistant for any classes in this semester.'
                    );
                }
            } catch (e: any) {
                console.error('Error fetching classes:', e);
                setError(e.message || 'Failed to fetch classes');
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [selectedSemester]); // Dependencies are stable strings, preventing loops.

    return {
        semesters,
        selectedSemester,
        setSelectedSemester,
        classes,
        loading: loading || semestersLoading, // Combine loading states for a seamless UI
        error,
    };
};
