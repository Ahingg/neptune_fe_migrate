import React from 'react';
import { useAtomValue } from 'jotai';
import { userAtom, isAdminAtom } from '../../store/auth';
import { useSemesters } from '../../hooks/useSemester';
import QuickActions from '../../components/dashboard/QuickActions';
import DashboardContent from '../../components/dashboard/DashboardContent';
import GlobalContestList from '../../components/dashboard/GlobalContestList';
import type { UserEnrollmentDetail } from '../../types/auth';
import AdminDashboardPage from '../Admin/AdminDashboardPage';
// A specific view for Admins

// A specific view for Students
const StudentDashboard: React.FC = () => {
    const user = useAtomValue(userAtom);
    const { currentSemester, loading: semesterLoading } = useSemesters();

    if (!user || semesterLoading) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const currentEnrollments =
        user.enrollments?.filter(
            (e: UserEnrollmentDetail) => e.semester_id === currentSemester?.semester_id
        ) || [];

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Main Content Area */}
            <section className="lg:w-3/4 xl:w-4/5 flex flex-col gap-8">
                <DashboardContent
                    user={user}
                    semester={currentSemester}
                    enrollments={currentEnrollments}
                />
                <GlobalContestList />
            </section>
            {/* Sidebar */}
            <aside className="lg:w-1/4 xl:w-1/5">
                <QuickActions />
            </aside>
        </div>
    );
};

// Main Dashboard Page Component
const DashboardPage: React.FC = () => {
    const user = useAtomValue(userAtom);
    const isAdmin = useAtomValue(isAdminAtom);

    // Initial loading state for the user object itself
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="bg-base-200 min-h-screen">
            <main className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-screen-2xl mx-auto">
                    {/* Render the correct dashboard based on the user's role */}
                    {isAdmin ? <AdminDashboardPage /> : <StudentDashboard />}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
