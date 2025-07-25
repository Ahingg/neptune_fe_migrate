import React from 'react';
import QuickActions from '../../components/dashboard/QuickActions';

const AdminDashboardPage: React.FC = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2 mb-4">
            Welcome, Admin. Use the navigation to manage contests, cases, and
            classes.

        </p>
        <QuickActions/>
        {/* Admin-specific components can be added here in the future */}
    </div>
);

export default AdminDashboardPage;
