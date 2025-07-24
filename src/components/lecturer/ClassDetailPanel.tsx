import React from 'react';
import { Link } from 'react-router-dom';
import useClassContests from '../../hooks/useClassContests';
import StudentList from '../class/StudentList'; // Re-using the student list component
import type { Class } from '../../types/class';
import type { UserProfile } from '../../types/auth';

const COURSE_NAMES: Record<string, string> = {
    '09a7b352-1f11-ec11-90f0-d8d385fce79e': 'Algorithm and Programming',
};

const ClassDetailPanel: React.FC<{ selectedClass: Class | null }> = ({
    selectedClass,
}) => {
    if (!selectedClass) {
        return (
            <div className="w-full bg-base-300 border border-gray-600 rounded-xl shadow p-6 flex items-center justify-center h-full">
                <div className="text-gray-400 text-center">
                    Select a class to view details
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-base-300 border border-gray-600 rounded-xl shadow p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
                Class Details
            </h2>
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-6">
                {/* Class Info */}
                <div>
                    <h3 className="text-2xl font-extrabold text-blue-700 mb-2 drop-shadow">
                        {selectedClass.class_code}
                    </h3>
                    <p className="text-blue-500 font-semibold">
                        Course:{' '}
                        <span className="font-normal text-gray-100">
                            {COURSE_NAMES[selectedClass.course_outline_id] ||
                                selectedClass.course_outline_id}
                        </span>
                    </p>
                </div>

                {/* Assistants */}
                <div>
                    <h4 className="text-xl text-blue-700 font-semibold mb-2">
                        Assistants
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {(selectedClass.assistants || []).map(
                            (assistant: UserProfile) => (
                                <div
                                    key={assistant.user_id}
                                    className="badge badge-lg bg-base-100 text-gray-100 p-3"
                                >
                                    {assistant.name}
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Contests */}
                <ContestSection classId={selectedClass.class_transaction_id} />

                {/* Students */}
                <div>
                    <h4 className="text-xl text-blue-700 font-semibold mb-2">
                        Students
                    </h4>
                    <StudentList students={selectedClass.students || []} />
                </div>
            </div>
        </div>
    );
};

const ContestSection: React.FC<{ classId: string }> = ({ classId }) => {
    const { contests, loading, error } = useClassContests(classId);

    return (
        <div>
            <h4 className="text-xl text-blue-700 font-semibold mb-2">
                Contests Assigned
            </h4>
            {loading ? (
                <p className="text-gray-400">Loading contests...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : contests.length === 0 ? (
                <p className="text-gray-400">No contests assigned.</p>
            ) : (
                <ul className="space-y-2">
                    {contests.map((contest) => (
                        <li key={contest.contest_id} className='w-1/2'>
                            <Link
                                to={`/class/${classId}/contest/${contest.contest_id}`}
                                className="btn btn-outline btn-primary btn-block justify-start"
                            >
                                {contest.contest?.name || 'Unnamed Contest'}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClassDetailPanel;
