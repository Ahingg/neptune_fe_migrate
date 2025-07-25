import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../store/auth';
import { useLeaderboardData } from '../../hooks/useLeaderboardData';
import LeaderboardTable from '../../components/leaderboard/LeaderboardTable';
import BackButton from '../../components/button/BackButton';

const LeaderboardPage: React.FC = () => {
    const { contestId, classId } = useParams<{
        contestId: string;
        classId?: string;
    }>();
    const currentUser = useAtomValue(userAtom);
    const { leaderboardData, loading, error } = useLeaderboardData(
        contestId,
        classId
    );
    const [showOnlyMe, setShowOnlyMe] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error || !leaderboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">
                    {error || 'No leaderboard data available.'}
                </p>
            </div>
        );
    }

    const filteredRows = showOnlyMe
        ? leaderboardData.leaderboard.filter(
            (row) => row.user_id === currentUser?.id
        )
        : leaderboardData.leaderboard;

    return (
        <>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-screen-xl mx-auto">
                    <BackButton />
                    <div className="flex justify-between items-center my-6">
                        <h1 className="text-3xl font-bold text-blue-700">
                            Leaderboard
                        </h1>
                        <div className="form-control">
                            <label className="label cursor-pointer gap-2">
                                <span className="label-text">Show Only Me</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={showOnlyMe}
                                    onChange={(e) =>
                                        setShowOnlyMe(e.target.checked)
                                    }
                                />
                            </label>
                        </div>
                    </div>
                    <LeaderboardTable
                        rows={filteredRows}
                        cases={leaderboardData.cases}
                    />
                </div>
            </main>
        </>
    );
};

export default LeaderboardPage;
