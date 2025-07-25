import React, { useState, useEffect } from 'react';
import useClassContests from '../../hooks/useClassContests';
import { useLeaderboardData } from '../../hooks/useLeaderboardData';
import LeaderboardTable from '../../components/leaderboard/LeaderboardTable';
import { useLecturerClasses } from '../../hooks/useLecturerClasses';

const LecturerLeaderboardPage: React.FC = () => {
    const { classes, loading: classesLoading } = useLecturerClasses();
    const [selectedClassId, setSelectedClassId] = useState<
        string | undefined
    >();
    const { contests, loading: contestsLoading } =
        useClassContests(selectedClassId);
    const [selectedContestId, setSelectedContestId] = useState<
        string | undefined
    >();

    const {
        leaderboardData,
        loading: leaderboardLoading,
        error: leaderboardError,
    } = useLeaderboardData(selectedContestId, selectedClassId);

    useEffect(() => {
        if (classes.length > 0 && !selectedClassId)
            setSelectedClassId(classes[0].class_transaction_id);
    }, [classes, selectedClassId]);

    useEffect(() => {
        if (contests.length > 0 && !selectedContestId)
            setSelectedContestId(contests[0].contest_id);
    }, [contests, selectedContestId]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">
                Class Leaderboards
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-base-300 rounded-lg border border-gray-600">
                <div>
                    <label className="label">
                        <span className="label-text text-blue-500">Class</span>
                    </label>
                    <select
                        className="select select-bordered w-full bg-base-100"
                        value={selectedClassId || ''}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        disabled={classesLoading}
                    >
                        {classes.map((cls) => (
                            <option
                                key={cls.class_transaction_id}
                                value={cls.class_transaction_id}
                            >
                                {cls.class_code}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="label">
                        <span className="label-text text-blue-500">
                            Contest
                        </span>
                    </label>
                    <select
                        className="select select-bordered w-full bg-base-100"
                        value={selectedContestId || ''}
                        onChange={(e) => setSelectedContestId(e.target.value)}
                        disabled={contestsLoading || !selectedClassId}
                    >
                        {contests.map((c) => (
                            <option key={c.contest_id} value={c.contest_id}>
                                {c.contest?.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-base-300 rounded-lg p-2 border border-gray-600">
                {leaderboardLoading ? (
                    <div className="text-center p-8">
                        <span className="loading loading-spinner"></span>
                    </div>
                ) : leaderboardError ? (
                    <div className="alert alert-error">{leaderboardError}</div>
                ) : leaderboardData ? (
                    <LeaderboardTable
                        rows={leaderboardData.leaderboard}
                        cases={leaderboardData.cases}
                    />
                ) : (
                    <div className="text-center p-8 text-gray-400">
                        Select a class and contest to view the leaderboard.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LecturerLeaderboardPage;
