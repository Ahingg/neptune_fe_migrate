import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AdminPageLayoutProps {
    title: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    loading?: boolean;
    error?: string | null;
    feedback?: string | null;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
    title,
    actions,
    children,
    loading,
    error,
    feedback,
}) => {
    return (
        <div className="container mx-auto p-6">
            <div className="bg-base-300 border border-gray-600 rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-700">
                        {title}
                    </h1>
                    <div className="flex gap-2">{actions}</div>
                </div>

                {error && (
                    <div role="alert" className="alert alert-error mb-4">
                        <AlertCircle />
                        <span>
                            <strong>Error:</strong> {error}
                        </span>
                    </div>
                )}
                {feedback && (
                    <div role="alert" className="alert alert-success mb-4">
                        <CheckCircle />
                        <span>{feedback}</span>
                    </div>
                )}

                {loading ? (
                    <div className="text-center p-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default AdminPageLayout;
    