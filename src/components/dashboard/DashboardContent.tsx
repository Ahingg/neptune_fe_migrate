import React from 'react';
import ClassCard from '../cards/ClassCard';import type { User, UserEnrollmentDetail } from '../../types/auth';
import type { Semester } from '../../types/semester';

interface DashboardContentProps {
    user: User | null;
    semester: Semester | null;
    enrollments: UserEnrollmentDetail[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({
    user,
    semester,
    enrollments,
}) => {
    return (
        <div className="bg-base-300 shadow-xl rounded-2xl p-0 border border-base-300 w-full h-full">
            <div className="p-8 border-b border-base-200">
                <h1 className="text-3xl font-bold text-blue-700 mb-2">
                    Welcome, {user?.name || 'Student'}
                </h1>
                <p className="text-gray-500">
                    Here are your enrolled classes for the current semester.
                </p>
                <div className="mt-4 text-sm text-blue-700 bg-base-200 rounded-full px-4 py-1 font-semibold inline-block">
                    {semester ? semester.description : 'Loading semester...'}
                </div>
                
            </div>

            <div className="p-8">
                {enrollments.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No classes found for this semester.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => (
                            <ClassCard
                                key={enrollment.class_transaction_id}
                                class_name={enrollment.class_name}
                                class_transaction_id={enrollment.class_transaction_id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardContent;
