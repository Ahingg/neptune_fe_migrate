import React, { useState, useEffect } from 'react';
import { useClasses } from '../../hooks/useClasses';
import useClassContests from '../../hooks/useClassContests';
import { useLeaderboardData } from '../../hooks/useLeaderboardData';

const AdminLeaderboardPage: React.FC = () => {
    // Admin can select any course and class
    const {
        classes,
        loading: classesLoading,
        error: classesError,
        courseOptions,
        courseId,
    } = useClasses();
    const [selectedCourseId, setSelectedCourseId] = useState<string>(courseId);
    const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
    const { contests, loading: contestsLoading, error: contestsError } = useClassContests(selectedClassId);
    const [selectedContestId, setSelectedContestId] = useState<string | undefined>();
    const { leaderboardData, loading: leaderboardLoading, error: leaderboardError } = useLeaderboardData(selectedContestId, selectedClassId);

    // Set default class and contest when data loads
    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) setSelectedClassId(classes[0].class_transaction_id);
    }, [classes, selectedClassId]);
    useEffect(() => {
        if (contests.length > 0 && !selectedContestId) setSelectedContestId(contests[0].contest_id);
    }, [contests, selectedContestId]);

    // Extract leaderboard and cases for table rendering
    const leaderboard = leaderboardData?.leaderboard || [];
    const cases = leaderboardData?.cases || [];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-extrabold mb-8 text-blue-800 drop-shadow">Leaderboard (Admin)</h1>
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Course Dropdown */}
                <div className="flex-1">
                    <label className="block mb-1 font-semibold text-blue-700">Course</label>
                    <select
                        className="select select-bordered w-full bg-white border-blue-200 text-blue-800 focus:ring-2 focus:ring-blue-400"
                        value={selectedCourseId}
                        onChange={e => {
                            setSelectedCourseId(e.target.value);
                            setSelectedClassId(undefined);
                            setSelectedContestId(undefined);
                        }}
                        disabled={classesLoading}
                    >
                        {courseOptions.map((opt: { id: string; name: string }) => (
                            <option key={opt.id} value={opt.id} className="text-blue-800 bg-white">
                                {opt.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Class Dropdown */}
                <div className="flex-1">
                    <label className="block mb-1 font-semibold text-blue-700">Class</label>
                    <select
                        className="select select-bordered w-full bg-white border-blue-200 text-blue-800 focus:ring-2 focus:ring-blue-400"
                        value={selectedClassId || ''}
                        onChange={e => {
                            setSelectedClassId(e.target.value);
                            setSelectedContestId(undefined);
                        }}
                        disabled={classesLoading}
                    >
                        <option value="" disabled>Select a class</option>
                        {classes.map((cls: any) => (
                            <option key={cls.class_transaction_id} value={cls.class_transaction_id} className="text-blue-800 bg-white">
                                {cls.class_code} - {cls.class_name || 'No name'}
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
                        {contests.map((contest: any) => (
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
                                    {cases.map((problem: any) => (
                                        <th key={problem.case_id} className="px-4 py-2 text-center">{problem.case_code}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((row: any, idx: number) => (
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
                                        {cases.map((problem: any) => {
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

export default AdminLeaderboardPage;
