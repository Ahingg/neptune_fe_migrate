import React from 'react';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../store/auth';
import { useSemester } from '../../hooks/useSemester';

import QuickActions from '../../components/dashboard/QuickActions';
import DashboardContent from '../../components/dashboard/DashboardContent';

const DashboardPage: React.FC = () => {
    const user = useAtomValue(userAtom);
    const { semester, loading: semesterLoading } = useSemester();

    if (!user || semesterLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const currentEnrollments =
        user.enrollments?.filter(
            (e) => e.semester_id === semester?.semester_id
        ) || [];

    return (
        <>
            <main className="px-4 sm:px-6 lg:px-8 pb-4 pt-12">
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                />

                {/* Main 2-column layout */}
                <div className="flex flex-col lg:flex-row gap-8 max-w-screen-2xl mx-auto">
                    {/* Left Column: Quick Actions */}

                    {/* Right Column: Main Content Panel */}
                    <section className="lg:w-3/4 xl:w-4/5">
                        <DashboardContent
                            user={user}
                            semester={semester}
                            enrollments={currentEnrollments}
                        />
                    </section>
                    <aside className="lg:w-1/4 xl:w-1/5">
                        <QuickActions />
                    </aside>
                </div>
            </main>
        </>
    );
};

export default DashboardPage;
