import React, { useState, useEffect } from 'react';
import useLecturerClasses from '../../hooks/useLecturerClasses';
import useClassContests from '../../hooks/useClassContests';


import axiosClient from '../../api/axiosClient';


const useClassContestSubmissions = (classId: string | undefined, contestId: string | undefined) => {

    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!classId || !contestId) {
            setSubmissions([]);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        axiosClient
            .get(`/api/submission/all/${contestId}?class_transaction_id=${classId}`)
            .then(res => setSubmissions(res.data || []))
            .catch(e => setError(e.response?.data?.error || e.message || 'Failed to fetch submissions'))


            .finally(() => setLoading(false));
    }, [classId, contestId]);

    return { submissions, loading, error };
};

const LecturerSubmissionsPage: React.FC = () => {
    const { classes, loading: classesLoading, error: classesError } = useLecturerClasses();
    const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
    const { contests, loading: contestsLoading, error: contestsError } = useClassContests(selectedClassId);
    const [selectedContestId, setSelectedContestId] = useState<string | undefined>();
    const { submissions, loading: submissionsLoading, error: submissionsError } = useClassContestSubmissions(selectedClassId, selectedContestId);

    // Set default class and contest when data loads
    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) setSelectedClassId(classes[0].class_transaction_id);


    }, [classes, selectedClassId]);
    useEffect(() => {
        if (contests.length > 0 && !selectedContestId) setSelectedContestId(contests[0].contest_id);


    }, [contests, selectedContestId]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-blue-800 drop-shadow">Submissions for My Classes</h1>
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Class Dropdown */}
                <div className="flex-1">
                    <label className="block mb-1 font-semibold text-blue-700">Class</label>
                    <select
                        className="select select-bordered w-full bg-white border-blue-200 text-blue-800 focus:ring-2 focus:ring-blue-400"
                        value={selectedClassId || ''}
                        onChange={e => {
                            setSelectedClassId(e.target.value);
                            setSelectedContestId(undefined); // reset contest selection
                        }}
                        disabled={classesLoading}
                    >
                        <option value="" disabled>Select a class</option>
                        {classes.map(cls => (
                            <option key={cls.class_transaction_id} value={cls.class_transaction_id} className="text-blue-800 bg-white">
                                {cls.class_code}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Contest Dropdown */}
                <div className="flex-1">
                    <label className="block mb-1 font-semibold text-blue-700">Contest</label>
                    <select
                        className="select select-bordered w-full bg-white border-blue-200 text-blue-800 focus:ring-2 focus:ring-blue-400"
                        value={selectedContestId || ''}
                        onChange={e => setSelectedContestId(e.target.value)}
                        disabled={contestsLoading || !selectedClassId}
                    >
                        <option value="" disabled>Select a contest</option>
                        {contests.map(contest => (
                            <option key={contest.contest_id} value={contest.contest_id} className="text-blue-800 bg-white">
                                {contest.contest?.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Table Section */}
            <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl shadow-2xl p-8 border border-blue-100">
                {submissionsLoading ? (
                    <div className="text-blue-600 text-center py-12 font-semibold text-lg">Loading submissions...</div>
                ) : submissionsError ? (
                    <div className="text-red-600 bg-red-50 p-3 rounded-lg">{submissionsError}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full table-zebra rounded-xl overflow-hidden">
                            <thead>
                                <tr className="bg-blue-200 text-blue-900">
                                    <th className="px-4 py-2 text-center">Student Name</th>
                                    <th className="px-4 py-2 text-center">Username</th>
                                    <th className="px-4 py-2 text-center">Case</th>
                                    <th className="px-4 py-2 text-center">Language</th>
                                    <th className="px-4 py-2 text-center">Status</th>
                                    <th className="px-4 py-2 text-center">Score</th>
                                    <th className="px-4 py-2 text-center">Submit Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub, idx) => (
                                    <tr
                                        key={sub.submission_id || idx}
                                        className={
                                            (idx % 2 === 0
                                                ? 'bg-blue-700 text-blue-50'
                                                : 'bg-blue-100 text-blue-900') +
                                            ' hover:bg-blue-300 transition-colors'
                                        }
                                    >
                                        <td className="px-4 py-2 text-center">{sub.name || sub.user_id}</td>
                                        <td className="px-4 py-2 text-center">{sub.username}</td>
                                        <td className="px-4 py-2 text-center">{sub.case_code || sub.case_id}</td>
                                        <td className="px-4 py-2 text-center">{sub.language_id}</td>
                                        <td
                                            className={
                                                'px-4 py-2 text-center ' +
                                                (sub.status === 'Accepted'
                                                    ? 'bg-green-200 text-green-900 font-bold'
                                                    : (sub.status === 'Wrong Answer' || sub.status === 'Internal Error')
                                                        ? 'bg-red-200 text-red-900 font-bold'
                                                        : '')
                                            }
                                        >
                                            {sub.status === 'Accepted' ? (
                                                'AC'
                                            ) : sub.status === 'Wrong Answer' || sub.status === 'Internal Error' ? (
                                                'WA'
                                            ) : (
                                                <span className="text-gray-600">{sub.status}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-center">{sub.score}</td>
                                        <td className="px-4 py-2 text-center">{sub.submit_time}</td>
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
