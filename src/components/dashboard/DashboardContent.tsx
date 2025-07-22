import React from 'react';
import ClassCard from '../cards/ClassCard';

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
        <div className="bg-blue-50 shadow-2xl rounded-2xl p-0 border border-blue-100 w-full h-full">
            {/* Merged Header Section */}
            <div className="p-8 border-b border-blue-200/60">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-2 drop-shadow">
                    Welcome, {user?.name || 'Student'}
                </h1>
                <p className="text-gray-600 mb-4 text-lg">
                    Here's your overview for the current semester.
                </p>
                <div className="text-sm text-blue-700 bg-white/60 rounded-full px-4 py-1 font-semibold inline-block border border-blue-200">
                    {semester ? semester.description : 'Loading semester...'}
                </div>
            </div>

            {/* Enrolled Classes Section */}
            <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-icons text-blue-500 text-3xl">
                        school
                    </span>
                    <h2 className="text-2xl font-bold text-blue-700">
                        Your Enrolled Classes
                    </h2>
                </div>
                {enrollments.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No classes found for this semester.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {enrollments.map((enrollment) => (
                            <ClassCard
                                key={enrollment.class_transaction_id}
                                enrollment={enrollment}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardContent;
