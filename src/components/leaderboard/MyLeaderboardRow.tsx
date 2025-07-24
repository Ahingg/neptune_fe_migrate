import React from 'react';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../store/auth';
import { useLeaderboardData } from '../../hooks/useLeaderboardData';
import { Link } from 'react-router-dom';
import type { LeaderboardCaseData, LeaderboardRow } from '../../types/leaderboard';

interface MyFullLeaderboardRowProps {
    contestId: string;
    classId?: string;
}

const getCellClass = (status: string) => {
    switch (status) {
        case 'AC':
            return 'bg-green-200 text-green-800 font-bold border-x border-x-green-400';
        case 'WA':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-base-100';
    }
};

const SingleRowDisplay: React.FC<{
    row: LeaderboardRow;
    cases: LeaderboardCaseData[];
}> = ({ row, cases }) => (
    <table className="table w-full">
        <thead className="bg-base-300">
            <tr>
                <th className="w-16 text-center">Rank</th>
                <th className="w-1/4">Student</th>
                <th className="w-24 text-center">Solved</th>
                <th className="w-24 text-center">Penalty</th>
                {cases.map((c) => (
                    <th
                        key={c.case_id}
                        className="w-24 text-center"
                        title={c.case_name}
                    >
                        {c.case_code}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            <tr className="bg-base-100">
                <td className="text-center font-bold text-lg text-gray-700">
                    {row.rank}
                </td>
                <td>
                    <div className="font-bold text-blue-500">{row.name}</div>
                    <div className="text-sm opacity-70">{row.username}</div>
                </td>
                <td className="text-center font-semibold text-lg text-green-600">
                    {row.solved_count}
                </td>
                <td className="text-center font-semibold text-red-500/50">
                    {row.total_penalty}
                </td>
                {cases.map((c) => {
                    const result = row.case_results[c.case_code];
                    return (
                        <td
                            key={c.case_id}
                            className={`text-center p-2 ${getCellClass(
                                result.status
                            )}`}
                        >
                            {result.is_solved ? (
                                <div>
                                    <div className="font-bold">
                                        {result.solve_time_minutes}
                                    </div>
                                    {result.wrong_attempts > 0 && (
                                        <div className="text-xs opacity-70">
                                            +{result.wrong_attempts}
                                        </div>
                                    )}
                                </div>
                            ) : result.wrong_attempts > 0 ? (
                                <div className="font-bold">
                                    -{result.wrong_attempts}
                                </div>
                            ) : (
                                <span>-</span>
                            )}
                        </td>
                    );
                })}
            </tr>
        </tbody>
    </table>
);

const MyFullLeaderboardRow: React.FC<MyFullLeaderboardRowProps> = ({
    contestId,
    classId,
}) => {
    const currentUser = useAtomValue(userAtom);
    const { leaderboardData, loading } = useLeaderboardData(contestId, classId);

    if (loading) {
        return (
            <div className="h-28 bg-gray-200 rounded-lg animate-pulse"></div>
        );
    }

    const myRow = leaderboardData?.leaderboard.find(
        (row) => row.user_id === currentUser?.id
    );

    return (
        <div className="bg-base-300 shadow-md rounded-lg p-4 border border-gray-600">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-blue-700">
                    My Standings
                </h3>
                <Link
                    to={`${
                        classId ? `/class/${classId}` : ''
                    }/contest/${contestId}/leaderboard`}
                    className="btn btn-sm btn-outline btn-primary"
                >
                    View Full Leaderboard
                </Link>
            </div>
            <div className="overflow-x-auto">
                {myRow && leaderboardData ? (
                    <SingleRowDisplay
                        row={myRow}
                        cases={leaderboardData.cases}
                    />
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        You have no submissions for this contest yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyFullLeaderboardRow;
