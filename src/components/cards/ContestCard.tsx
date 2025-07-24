import { ArrowRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import type { ClassContestAssignment } from '../../types/class';
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
                className={`p-4 rounded-lg border-1 border-l-4 flex justify-between items-center  ${
                    status === 'current'
                        ? 'border-blue-500 bg-base-200 hover:bg-base-100'
                        : status === 'future'
                        ? 'border-gray-400 bg-base-200 hover:bg-base-100 cursor-not-allowed'
                        : 'border-green-500 bg-base-200 hover:bg-base-100'
                } ${
                    status !== 'future'
                        ? 'hover:bg-opacity-80 transition-colors'
                        : ''
                }`}
                key={assignment.contest_id}
            >
            <div className=''>
                <h3 className="font-bold text-blue-600">
                    {assignment.contest?.name || 'Contest'}
                </h3>
                <p className="text-xs text-blue-500/50">
                    <strong>Starts:</strong> {formatDate(assignment.start_time)}
                </p>
                <p className="text-xs text-blue-500/50">
                    <strong>Ends:</strong> {formatDate(assignment.end_time)}
                </p>
            </div>

            <div>
                <ArrowRight size={36} className='text-blue-500/50'/>
            </div>
        </div>
    );

    // If the contest is in the future, it's not a clickable link
    if (status === 'future') {
        return <div>{content}</div>;
    }

    // Otherwise, wrap it in a link to the contest detail page
    return (
        <Link
            to={`/class/${assignment.class_transaction_id}/contest/${assignment.contest_id}`}
        >
            {content}
        </Link>
    );
};

export default ContestCard;
