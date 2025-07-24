import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContests } from '../../hooks/useGlobalContest';

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString();

const GlobalContestList: React.FC = () => {
    const { contests, loading, error } = useGlobalContests();

    return (
        <div className="bg-base-300 rounded-2xl shadow-lg p-6 border border-base-300">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
                Global Contests
            </h2>
            {loading && (
                <div className="text-center p-4">
                    <span className="loading loading-spinner"></span>
                </div>
            )}
            {error && <div className="alert alert-error">{error}</div>}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Contest Name</th>
                                <th>Starts</th>
                                <th>Ends</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {contests.map((contest) => (
                                <tr key={contest.id} className="hover">
                                    <td className="font-semibold text-blue-500">
                                        {contest.name}
                                    </td>
                                    <td>{formatDate(contest.start_time)}</td>
                                    <td>{formatDate(contest.end_time)}</td>
                                    <td className="text-right">
                                        <Link
                                            to={`/contest/global/${contest.id}`}
                                            className="btn btn-sm btn-primary btn-outline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GlobalContestList;
