import React from 'react';

const AdminDashboardPage: React.FC = () => {
    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-700">
                    Admin Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                    Welcome, Admin. Use the navigation links to manage the
                    platform.
                </p>
                {/* You can add admin-specific widgets or stats here in the future */}
            </div>
        </main>
    );
};

export default AdminDashboardPage;
