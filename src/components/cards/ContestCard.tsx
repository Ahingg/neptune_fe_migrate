import React from 'react';
import { Link } from 'react-router-dom';
interface ContestCardProps {
    assignment: ClassContestAssignment;
    status: 'current' | 'future' | 'past';
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const ContestCard: React.FC<ContestCardProps> = ({ assignment, status }) => {
    const content = (
        <div
            className={`p-4 rounded-lg border-1 border-l-4  ${
                status === 'current'
                    ? 'border-blue-500 bg-blue-50'
                    : status === 'future'
                    ? 'border-gray-400 bg-gray-50 cursor-not-allowed'
                    : 'border-green-500 bg-green-50'
            } ${
                status !== 'future'
                    ? 'hover:bg-opacity-80 transition-colors'
                    : ''
            }`}
        >
            <h3 className="font-bold text-blue-800">
                {assignment.contest?.name || 'Contest'}
            </h3>
            <p className="text-xs text-blue-600">
                <strong>Starts:</strong> {formatDate(assignment.start_time)}
            </p>
            <p className="text-xs text-blue-600">
                <strong>Ends:</strong> {formatDate(assignment.end_time)}
            </p>
        </div>
    );

    // If the contest is in the future, it's not a clickable link
    if (status === 'future') {
        return <div>{content}</div>;
    }

    // Otherwise, wrap it in a link to the contest detail page
    return <Link to={`/contest/${assignment.contest_id}`}>{content}</Link>;
};

export default ContestCard;
