import React, { useState, useEffect } from 'react';
import { useLecturerClasses } from '../../hooks/useLecturerClasses';
import ClassDetailPanel from '../../components/lecturer/ClassDetailPanel';
import type { Class } from '../../types/class';
import ClassListPanel from '../../components/lecturer/ClasstListPanel';

const LecturerClassesPage: React.FC = () => {
    // All complex logic is now cleanly handled by our custom hook.
    const {
        semesters,
        selectedSemester,
        setSelectedSemester,
        classes,
        loading,
        error,
    } = useLecturerClasses();

    // The page now only needs to manage which class is currently being viewed.
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    // This effect ensures a class is always selected by default if the list is not empty.
    useEffect(() => {
        if (classes.length > 0) {
            const isSelectedClassStillValid = classes.some(
                (c) =>
                    c.class_transaction_id ===
                    selectedClass?.class_transaction_id
            );
            if (!isSelectedClassStillValid) {
                setSelectedClass(classes[0]);
            }
        } else {
            setSelectedClass(null);
        }
    }, [classes, selectedClass]);

    return (
        <div className="container mx-auto py-6">
            <div
                className="flex flex-col lg:flex-row gap-6"
                style={{ minHeight: '80vh' }}
            >
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
                <div className="lg:w-2/3">
                    <ClassDetailPanel selectedClass={selectedClass} />
                </div>
            </div>
        </div>
    );
};

export default LecturerClassesPage;
