import React, { useState, useMemo } from 'react';
import ContestCard from '../cards/ContestCard';
import type { ClassContestAssignment } from '../../types/class';

type FilterType = 'Current' | 'Future' | 'Past';

interface ContestListProps {
    contests: ClassContestAssignment[];
}

const ContestList: React.FC<ContestListProps> = ({ contests }) => {
    const [filter, setFilter] = useState<FilterType>('Current');

    const filteredContests = useMemo(() => {
        const now = new Date();
        return contests.filter((c) => {
            const start = new Date(c.start_time);
            const end = new Date(c.end_time);
            if (filter === 'Current') return start <= now && end >= now;
            if (filter === 'Future') return start > now;
            if (filter === 'Past') return end < now;
            return false;
        });
    }, [contests, filter]);

    const getStatus = (
        start: Date,
        end: Date
    ): 'current' | 'future' | 'past' => {
        const now = new Date();
        if (start <= now && end >= now) return 'current';
        if (start > now) return 'future';
        return 'past';
    };

    return (
        <div className="bg-base-300 shadow-lg rounded-2xl p-6 border border-gray-600 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-800">
                    Assigned Contests
                </h2>
                <div className="tabs ">
                    {(['Current', 'Future', 'Past'] as FilterType[]).map(
                        (f, index, arr) => (
                            <a
                                key={f}
                                className={`tab 
         hover:border-blue-600
        ${
            filter === f
                ? 'tab-active border-2 border-blue-600 font-bold text-blue-600 hover:text-blue-500 '
                : ''
        }
        ${index === 0 ? 'rounded-l-lg' : ''}
        ${index === arr.length - 1 ? 'rounded-r-lg' : ''}
    `}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </a>
                        )
                    )}
                </div>
            </div>
            <div className="space-y-4">
                {filteredContests.length > 0 ? (
                    filteredContests.map((assignment) => (
                        <ContestCard
                            key={assignment.contest_id}
                            assignment={assignment}
                            status={getStatus(
                                new Date(assignment.start_time),
                                new Date(assignment.end_time)
                            )}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 pt-8">
                        No {filter.toLowerCase()} contests found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ContestList;
