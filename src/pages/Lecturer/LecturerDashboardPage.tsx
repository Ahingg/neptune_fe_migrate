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
                <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-2xl shadow-2xl p-8 flex-1 border border-blue-100">
                    {/* Welcome Message */}
                    <div className="bg-white/90 shadow-xl rounded-2xl p-0 border border-blue-100 w-full mb-8">
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
                    <h2 className="text-2xl font-bold text-blue-700 mb-4 drop-shadow">My Assistant Classes (Current Semester)</h2>
                    {loading && <div className="text-gray-800">Loading...</div>}
                    {error && <div className="text-red-700 text-gray-800">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {classes.map(cls => (
                            <div key={cls.class_transaction_id} className="bg-white rounded-xl shadow-md border border-blue-100 p-6 flex flex-col items-start hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-icons text-blue-500">class</span>
                                    <span className="text-lg font-bold text-blue-700">{cls.class_code}</span>
                                </div>
                                {/* Assistants List */}
                                {Array.isArray(cls.assistants) && cls.assistants.length > 0 && (
                                    <div className="text-sm text-blue-700 mb-2">
                                        Assistant: {(cls.assistants ?? []).map((assistant: any, idx: number) => (
                                            <span key={assistant.user_id || assistant.UserID}>
                                                {(assistant.name || (assistant.User && assistant.User.Name))} ({assistant.username || (assistant.User && assistant.User.Username)}){idx < (cls.assistants?.length ?? 0) - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <button
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                    onClick={() => navigate('/lecturer/classes')}
                                >
                                    View Details
                                </button>
                            </div>
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
