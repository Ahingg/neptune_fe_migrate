import React, { useState, useEffect } from 'react';
import useLecturerClasses from '../../hooks/useLecturerClasses';
import useClassContests from '../../hooks/useClassContests';
import axiosClient from '../../api/axiosClient';

interface Case {
    case_id: string;
    case_code: string;
    case_name: string;
}

interface CaseResult {
    case_id: string;
    submission_id: string;
    status: string;
    score: number;
    is_solved: boolean;
    solve_time_minutes: number;
    wrong_attempts: number;
}

interface LeaderboardRow {
    rank: number;
    user_id: string;
    username: string;
    name: string;
    solved_count: number;
    total_penalty: number;
    case_results: Record<string, CaseResult>;
}

const useLeaderboard = (classId: string | undefined, contestId: string | undefined) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!classId || !contestId) {
            setLeaderboard([]);
            setCases([]);
            setError(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        axiosClient
            .get(`/api/classes/${classId}/contests/${contestId}/leaderboard`)
            .then(res => {
                setLeaderboard(res.data.leaderboard || []);
                setCases(res.data.cases || []);
            })
            .catch(e => setError(e.response?.data?.error || e.message || 'Failed to fetch leaderboard'))
            .finally(() => setLoading(false));
    }, [classId, contestId]);

    return { leaderboard, cases, loading, error };
};

const LecturerLeaderboardPage: React.FC = () => {
    const { classes, loading: classesLoading } = useLecturerClasses();
    const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
    const { contests, loading: contestsLoading } = useClassContests(selectedClassId);
    const [selectedContestId, setSelectedContestId] = useState<string | undefined>();
    const { leaderboard, cases, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard(selectedClassId, selectedContestId);

    // Set default class and contest when data loads
    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) setSelectedClassId(classes[0].class_transaction_id);
    }, [classes, selectedClassId]);
    useEffect(() => {
        if (contests.length > 0 && !selectedContestId) setSelectedContestId(contests[0].contest_id);
    }, [contests, selectedContestId]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-blue-800 drop-shadow">Leaderboard for My Classes</h1>
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
                                {contest.contest?.name || 'No name'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Leaderboard Table */}
            <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl shadow-2xl p-8 border border-blue-100">
                {leaderboardLoading ? (
                    <div className="text-blue-600 text-center py-12 font-semibold text-lg">Loading leaderboard...</div>
                ) : leaderboardError ? (
                    <div className="text-red-600 bg-red-50 p-3 rounded-lg">{leaderboardError}</div>
                ) : leaderboard.length === 0 ? (
                    <div className="text-gray-400 text-center py-12">Leaderboard will be displayed here.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full table-zebra rounded-xl overflow-hidden">
                            <thead>
                                <tr className="bg-blue-500 text-blue-900">
                                    <th className="px-4 py-2 text-center">Rank</th>
                                    <th className="px-4 py-2 text-center">Name</th>
                                    <th className="px-4 py-2 text-center">Username</th>
                                    <th className="px-4 py-2 text-center">Solved</th>
                                    <th className="px-4 py-2 text-center">Penalty</th>
                                    {cases.map(problem => (
                                        <th key={problem.case_id} className="px-4 py-2 text-center">{problem.case_code}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((row, idx) => (
                                    <tr
                                        key={row.user_id}
                                        className={
                                            idx === 0
                                                ? 'bg-blue-100 font-bold text-yellow-900'
                                                : idx === 1
                                                    ? 'bg-gray-200 font-semibold text-gray-800'
                                                    : idx === 2
                                                        ? 'bg-orange-100 font-semibold text-orange-900'
                                                        : 'hover:bg-blue-50 transition-colors'
                                        }
                                    >
                                        <td className="px-4 py-2 text-center">{row.rank}</td>
                                        <td className="px-4 py-2 text-center">{row.name}</td>
                                        <td className="px-4 py-2 text-center">{row.username}</td>
                                        <td className="px-4 py-2 text-center">{row.solved_count}</td>
                                        <td className="px-4 py-2 text-center">{row.total_penalty}</td>
                                        {cases.map(problem => {
                                            const result = row.case_results[problem.case_code];
                                            let cellClass = "px-4 py-2 text-center ";
                                            if (result) {
                                                cellClass += result.score === 100
                                                    ? "bg-green-200 text-green-900 font-bold"
                                                    : "bg-red-200 text-red-900 font-bold";
                                            }
                                            return (
                                                <td key={row.user_id + '-' + problem.case_id} className={cellClass}>
                                                    {result ? result.score : <span className="text-gray-400">-</span>}
                                                </td>
                                            );
                                        })}
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

export default LecturerLeaderboardPage;
