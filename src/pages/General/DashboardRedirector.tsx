import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import StudentDashboardPage from './DashboardPage'; // Assuming this is the student dashboard
import LecturerDashboardPage from '../Lecturer/LecturerDashboardPage';
import AdminDashboardPage from '../Admin/AdminDashboardPage';

const DashboardRedirector: React.FC = () => {
    const { user } = useAuth();

    // Based on the user's role, render the correct dashboard component.
    switch (user?.role) {
        case 'Admin':
            return <AdminDashboardPage />;
        case 'Lecturer':
        case 'Assistant':
            return <LecturerDashboardPage />;
        case 'Student':
            return <StudentDashboardPage />;
        default:
            // Fallback for unknown roles or while user data is loading
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <p>Loading dashboard...</p>
                </div>
            );
    }
};

export default DashboardRedirector;
