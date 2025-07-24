import React from 'react';
import type {
    LeaderboardCaseData,
    LeaderboardRow,
} from '../../types/leaderboard';

interface LeaderboardTableProps {
    rows: LeaderboardRow[];
    cases: LeaderboardCaseData[];
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

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ rows, cases }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-800">
            <table className="table w-full">
                <thead className="bg-base-300">
                    <tr>
                        <th className="w-16 text-center">Rank</th>
                        <th className="w-1/4">Student</th>
                        <th className="w-24 text-center">Solved</th>
                        <th className="w-24 text-center">Penalty</th>
                        {cases.map((c) => (
                            <th key={c.case_id} className="w-24 text-center">
                                {c.case_code}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.user_id} className="hover:bg-gray-700/50">
                            <td className="text-center font-bold text-lg text-blue-300">
                                {row.rank}
                            </td>
                            <td>
                                <div className="font-bold text-blue-300">
                                    {row.name}
                                </div>
                                <div className="text-sm opacity-70">
                                    {row.username}
                                </div>
                            </td>
                            <td className="text-center font-semibold text-lg text-green-600">
                                {row.solved_count}
                            </td>
                            <td className="text-center font-semibold text-red-300">
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
                                                    {result.score}
                                                </div>
                                                {result.wrong_attempts > 0 && (
                                                    <div className="text-xs opacity-70">
                                                        ({result.wrong_attempts} - {result.solve_time_minutes})
                                                    </div>
                                                )}
                                            </div>
                                        ) : result.wrong_attempts > 0 ? (
                                            <div className="font-bold">
                                                ({result.wrong_attempts})
                                            </div>
                                        ) : (
                                            <span>0</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardTable;
