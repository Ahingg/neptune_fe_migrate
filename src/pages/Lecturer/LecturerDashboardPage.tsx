import React from 'react';
import ActionCard from '../../components/cards/ActionCard';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../store/auth';
import { useSemesters } from '../../hooks/useSemester';
import ClassCard from '../../components/cards/ClassCard';
import type { Class } from '../../types/class';
import GlobalContestList from '../../components/dashboard/GlobalContestList';
import { useLecturerClasses } from '../../hooks/useLecturerClasses';

const LecturerDashboardPage: React.FC = () => {
    const { classes, loading, error } = useLecturerClasses();
    const user = useAtomValue(userAtom);
    const { currentSemester } = useSemesters();

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-8 max-w-screen-2xl mx-auto relative">
                {/* Main Box */}
                <div className="bg-base-300 rounded-2xl shadow-2xl p-8 flex-1 border border-gray-600 relative">
                    <div className="bg-base-200 shadow-xl rounded-2xl p-0 border border-gray-600 w-full mb-8">
                        <div className="p-8">
                            <h1 className="text-4xl font-extrabold text-blue-700 mb-2 drop-shadow">
                                Welcome, {user?.name || 'Lecturer'}
                            </h1>
                            <p className="text-gray-600 mb-4 text-lg">
                                Here&apos;s your overview for the current
                                semester.
                            </p>
                            <div className="text-sm text-blue-700 bg-base-100 rounded-full px-4 py-1 font-semibold inline-block border border-gray-700">
                                {currentSemester
                                    ? currentSemester.description
                                    : 'Loading semester...'}
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-700 mb-4 drop-shadow">
                        My Assistant Classes (Current Semester)
                    </h2>
                    {loading && <div className="text-gray-800">Loading...</div>}
                    {error && <div className="text-red-700">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {classes.map((cls: Class) => (
                            <ClassCard
                                key={cls.class_transaction_id}
                                class_name={cls.class_code}
                                class_transaction_id={cls.class_transaction_id}
                            />
                        ))}
                        {!loading && classes.length === 0 && (
                            <div className="text-gray-400">
                                You are not an assistant in any class this
                                semester.
                            </div>
                        )}
                    </div>
                    <GlobalContestList />
                </div>
                {/* Sidebar: Quick Actions */}
                <aside className="lg:w-1/4 xl:w-1/5 flex flex-col">
                    <h3 className="text-2xl font-bold text-blue-500 mb-4 text-left">
                        Quick Actions
                    </h3>
                    <div className="flex flex-col gap-6">
                        <ActionCard
                            to="/lecturer/classes"
                            icon="class"
                            title="Classes"
                            description="View your assigned classes as an assistant"
                        />
                        <ActionCard
                            to="/lecturer/contests"
                            icon="emoji_events"
                            title="Contests"
                            description="View contests for your classes as an assistant"
                        />
                        <ActionCard
                            to="/lecturer/submissions"
                            icon="assignment_turned_in"
                            title="Submissions"
                            description="View and manage submissions for your classes as an assistant"
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LecturerDashboardPage;
