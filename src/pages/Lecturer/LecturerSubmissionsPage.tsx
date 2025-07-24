import React, { useState, useEffect } from 'react';
import useLecturerClasses from '../../hooks/useLecturerClasses';
import useClassContests from '../../hooks/useClassContests';
// We'll implement this hook below
// import useContestSubmissions from '../../hooks/useContestSubmissions';
import axiosClient from '../../api/axiosClient';
import { getAllSubmissions } from '../../api/submission';

// Temporary: Inline hook for fetching submissions for a contest
function useContestSubmissions(contestId: string | undefined) {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!contestId) {
            setSubmissions([]);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        getAllSubmissions()
            .then((allSubs) => {
                // Filter by contestId
                setSubmissions(allSubs.filter((s: any) => s.contest_id === contestId));
            })
            .catch(e => setError(e.message || 'Failed to fetch submissions'))
            .finally(() => setLoading(false));
    }, [contestId]);

    return { submissions, loading, error };
}

const LecturerSubmissionsPage: React.FC = () => {
    const { classes, loading: classesLoading, error: classesError } = useLecturerClasses();
    const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);
    const { contests, loading: contestsLoading, error: contestsError } = useClassContests(selectedClassId);
    const [selectedContestId, setSelectedContestId] = useState<string | undefined>(undefined);
    const { submissions, loading: submissionsLoading, error: submissionsError } = useContestSubmissions(selectedContestId);

    // Set default class and contest when data loads
    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0].class_transaction_id);
        }
    }, [classes, selectedClassId]);
    useEffect(() => {
        if (contests.length > 0 && !selectedContestId) {
            setSelectedContestId(contests[0].contest_id);
        }
    }, [contests, selectedContestId]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-blue-800">Submissions for My Classes</h1>
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Class Dropdown */}
                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Class</label>
                    <select
                        className="select select-bordered w-full"
                        value={selectedClassId || ''}
                        onChange={e => {
                            setSelectedClassId(e.target.value);
                            setSelectedContestId(undefined); // reset contest selection
                        }}
                        disabled={classesLoading}
                    >
                        <option value="" disabled>Select a class</option>
                        {classes.map(cls => (
                            <option key={cls.class_transaction_id} value={cls.class_transaction_id}>
                                {cls.class_code}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Contest Dropdown */}
                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Contest</label>
                    <select
                        className="select select-bordered w-full"
                        value={selectedContestId || ''}
                        onChange={e => setSelectedContestId(e.target.value)}
                        disabled={contestsLoading || !selectedClassId}
                    >
                        <option value="" disabled>Select a contest</option>
                        {contests.map(contest => (
                            <option key={contest.contest_id} value={contest.contest_id}>
                                {contest.contest?.name || 'No name'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Table Section */}
            <div className="bg-white rounded-xl shadow p-4">
                {submissionsLoading ? (
                    <div>Loading submissions...</div>
                ) : submissionsError ? (
                    <div className="text-red-600 bg-red-50 p-3 rounded-lg">{submissionsError}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full table-zebra">
                            <thead>
                                <tr className="bg-base-200">
                                    <th>Student Name</th>
                                    <th>Case Name</th>
                                    <th>Language</th>
                                    <th>Status</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub, idx) => (
                                    <tr key={sub.id || idx}>
                                        <td>{sub.student_name || sub.user_id}</td>
                                        <td>{sub.case_name || sub.case_id}</td>
                                        <td>{sub.language_name || sub.language_id}</td>
                                        <td>{sub.status}</td>
                                        <td>{sub.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LecturerSubmissionsPage;
