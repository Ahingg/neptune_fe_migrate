import React, { useEffect, useState } from 'react';
import { getAllSemestersApi, getCurrentSemesterApi } from '../../api/semester';
import { getAllClassesBySemesterIdApi, getClassByIdApi } from '../../api/class';
import { getMeApi } from '../../api/auth';
import ClassDetailPanel from '../../components/lecturer/ClassDetailPanel';
import type { Semester } from '../../types/semester';
import type { Class } from '../../types/class';
import ClassListPanel from '../../components/lecturer/ClasstListPanel';

const DEFAULT_COURSE_ID = '09a7b352-1f11-ec11-90f0-d8d385fce79e';

const LecturerClassesPage: React.FC = () => {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<string>('');
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Fetch initial data: semesters and user ID
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [allSemesters, currentSemester, me] = await Promise.all([
                    getAllSemestersApi(),
                    getCurrentSemesterApi(),
                    getMeApi(),
                ]);
                setSemesters(allSemesters);
                setSelectedSemester(currentSemester.semester_id);
                setUserId(me.user.id);
            } catch (e: any) {
                setError(e.message || 'Failed to fetch initial data');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch classes when selected semester or user ID changes
    useEffect(() => {
        if (!selectedSemester || !userId) return;

        const fetchClasses = async () => {
            setLoading(true);
            setError(null);
            setClasses([]);
            setSelectedClass(null);

            try {
                const allClasses = await getAllClassesBySemesterIdApi(
                    selectedSemester,
                    DEFAULT_COURSE_ID
                );
                const details = await Promise.all(
                    allClasses.map((cls) =>
                        getClassByIdApi(cls.class_transaction_id)
                    )
                );

                const filtered = details.filter((cls) =>
                    (cls.assistants || []).some(
                        (a: any) => a.user_id === userId
                    )
                );

                setClasses(filtered);
                if (filtered.length > 0) {
                    setSelectedClass(filtered[0]);
                } else {
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
    }, [selectedSemester, userId]);

    return (
        <div className="container mx-auto py-6">
            <div
                className="flex flex-col lg:flex-row gap-6"
                style={{ minHeight: '80vh' }}
            >
                {/* Left Panel */}
                <div className="lg:w-1/3">
                    <ClassListPanel
                        semesters={semesters}
                        selectedSemester={selectedSemester}
                        onSemesterChange={setSelectedSemester}
                        classes={classes}
                        selectedClass={selectedClass}
                        onSelectClass={setSelectedClass}
                        loading={loading}
                        error={error}
                    />
                </div>
                {/* Right Panel */}
                <div className="lg:w-2/3">
                    <ClassDetailPanel selectedClass={selectedClass} />
                </div>
            </div>
        </div>
    );
};

export default LecturerClassesPage;
