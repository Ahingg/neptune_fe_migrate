import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLecturerClasses from '../../hooks/useLecturerClasses';
import ActionCard from '../../components/cards/ActionCard';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../store/auth';
import { useSemester } from '../../hooks/useSemester';

const LecturerDashboardPage: React.FC = () => {
    const { classes, loading, error } = useLecturerClasses();
    const navigate = useNavigate();
    const user = useAtomValue(userAtom);
    const { semester } = useSemester();

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-8 max-w-screen-2xl mx-auto">
                {/* Main Box */}
                <div className="bg-white rounded-xl shadow p-6 flex-1">
                    {/* Welcome Message */}
                    <div className="bg-blue-50 shadow-2xl rounded-2xl p-0 border border-blue-100 w-full mb-6">
                        <div className="p-8 border-b border-blue-200/60">
                            <h1 className="text-4xl font-extrabold text-blue-700 mb-2 drop-shadow">
                                Welcome, {user?.name || 'Lecturer'}
                            </h1>
                            <p className="text-gray-600 mb-4 text-lg">
                                Here&apos;s your overview for the current semester.
                            </p>
                            <div className="text-sm text-blue-700 bg-white/60 rounded-full px-4 py-1 font-semibold inline-block border border-blue-200">
                                {semester ? semester.description : 'Loading semester...'}
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">My Assistant Classes (Current Semester)</h2>
                    {loading && <div className="text-gray-800">Loading...</div>}
                    {error && <div className="text-red-700 text-gray-800">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {classes.map(cls => (
                            <ActionCard
                                key={cls.class_transaction_id}
                                to="/lecturer/classes"
                                icon="class"
                                title={cls.class_code}
                                description={cls.class_name || 'No name'}
                            />
                        ))}
                        {(!loading && classes.length === 0) && (
                            <div className="text-gray-400">You are not an assistant in any class this semester.</div>
                        )}
                    </div>
                </div>
                {/* Sidebar: Quick Actions */}
                <aside className="lg:w-1/4 xl:w-1/5 flex flex-col">
                    <h3 className="text-xl font-bold text-blue-500 mb-4 text-left">Quick Actions</h3>
                    <div className="flex flex-col gap-6">
                        <ActionCard
                            to="/lecturer/classes"
                            icon="class"
                            title="Classes"
                            description="View your assigned classes"
                        />
                        <ActionCard
                            to="/contests"
                            icon="emoji_events"
                            title="Contests"
                            description="View and participate in contests"
                        />
                        <ActionCard
                            to="/submission"
                            icon="assignment_turned_in"
                            title="Submission"
                            description="View and manage submissions"
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LecturerDashboardPage;
