import React, { useState, useEffect } from 'react';
import useClassContests from '../../hooks/useClassContests';
import { useClassContestSubmissions } from '../../hooks/useClassContestSubmissions';
import type { SubmissionHistoryItem } from '../../types/submission';
import type { Class } from '../../types/class';
import { useLecturerClasses } from '../../hooks/useLecturerClasses';

const LecturerSubmissionsPage: React.FC = () => {
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
        submissions,
        loading: submissionsLoading,
        error: submissionsError,
    } = useClassContestSubmissions(selectedClassId, selectedContestId);

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
                Class Submissions
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
                        {classes.map((cls: Class) => (
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

            <div className="bg-base-300 rounded-lg p-4 border border-gray-600">
                {submissionsLoading ? (
                    <div className="text-center p-8">
                        <span className="loading loading-spinner"></span>
                    </div>
                ) : submissionsError ? (
                    <div className="alert alert-error">{submissionsError}</div>
                ) : (
                    <SubmissionsTable submissions={submissions} />
                )}
            </div>
        </div>
    );
};

const SubmissionsTable: React.FC<{ submissions: SubmissionHistoryItem[] }> = ({
    submissions,
}) => (
    <div className="overflow-x-auto">
        <table className="table w-full">
            <thead className="bg-base-100">
                <tr>
                    <th>Student</th>
                    <th>Case</th>
                    <th>Status</th>
                    <th className="text-center">Score</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {submissions
                    .slice()
                    .sort(
                        (a, b) =>
                            new Date(b.submit_time).getTime() -
                            new Date(a.submit_time).getTime()
                    )
                    .map((sub) => (
                        <tr key={sub.submission_id} className="hover">
                            <td>
                                {sub.username} - {sub.name}
                            </td>
                            <td>{sub.case_code}</td>
                            <td
                                className={
                                    sub.status === 'Accepted'
                                        ? 'text-green-500 font-semibold'
                                        : 'text-red-500'
                                }
                            >
                                {sub.status}
                            </td>
                            <td className="text-center font-semibold">
                                {sub.score}
                            </td>
                            <td className="text-xs">
                                {new Date(sub.submit_time).toLocaleString()}
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    </div>
);

export default LecturerSubmissionsPage;
