import React, { useMemo } from 'react';
import { useSubmissionHistory } from '../../hooks/useSubmissionHistory';
import SubmissionHistoryRow from './SubmissionHistoryRow';

interface SubmissionHistoryProps {
    contestId?: string;
    classId?: string;
    caseId: string | null; // To filter submissions for the currently selected case
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
    contestId,
    classId,
    caseId,
}) => {
    const { submissions, loading, error } = useSubmissionHistory(
        contestId,
        classId
    );

    const filteredSubmissions = useMemo(() => {
        if (!caseId) return [];
        return submissions
            .filter((sub) => sub.case_id === caseId)
            .sort((a, b) => new Date(b.submit_time).getTime() - new Date(a.submit_time).getTime());
    }, [submissions, caseId]);

    if (loading) {
        return (
            <div className="text-center p-8">
                <span className="loading loading-spinner"></span>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    if (filteredSubmissions.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500">
                No submissions for this case yet.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto max-h-96">
            <table className="table table-sm w-full">
                <thead className="bg-base-200">
                    <tr>
                        <th>Case</th>
                        <th>Status</th>
                        <th className="text-center">Score</th>
                        <th>Language</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSubmissions.map((sub) => (
                        <SubmissionHistoryRow
                            key={sub.submission_id}
                            submission={sub}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubmissionHistory;
