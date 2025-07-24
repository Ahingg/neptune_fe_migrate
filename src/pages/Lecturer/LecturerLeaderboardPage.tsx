import React, { useState, useEffect } from 'react';
import useLecturerClasses from '../../hooks/useLecturerClasses';
import useClassContests from '../../hooks/useClassContests';

// Placeholder for leaderboard data hook
function useLeaderboardData(classId: string | undefined, contestId: string | undefined) {
    return { data: [], loading: false, error: null };
}

const LecturerLeaderboardPage: React.FC = () => {
    const { classes, loading: classesLoading, error: classesError } = useLecturerClasses();
    const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
    const { contests, loading: contestsLoading, error: contestsError } = useClassContests(selectedClassId);
    const [selectedContestId, setSelectedContestId] = useState<string | undefined>();
    const { data: leaderboardData, loading: leaderboardLoading } = useLeaderboardData(selectedClassId, selectedContestId);

    // Set default class and contest when data loads
    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) setSelectedClassId(classes[0].class_transaction_id);
    }, [classes, selectedClassId]);
    useEffect(() => {
        if (contests.length > 0 && !selectedContestId) setSelectedContestId(contests[0].contest_id);
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
            {/* TODO: Pass classId and contestId to Leaderboard component */}
            <div className="bg-white rounded-xl shadow p-4">
                {leaderboardLoading ? (
                    <div className="text-gray-400 text-center py-12">Loading leaderboard...</div>
                ) : leaderboardData.length === 0 ? (
                    <div className="text-gray-400 text-center py-12">Leaderboard will be displayed here.</div>
                ) : (
                    <div>Leaderboard data goes here</div>
                )}
            </div>
        </div>
    );
};

export default LecturerLeaderboardPage;
