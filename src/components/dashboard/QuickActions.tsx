import React from 'react';
import ActionCard from '../cards/ActionCard';

const QuickActions: React.FC = () => {
    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-blue-500 mb-4 text-left">
                Quick Actions
            </h3>
            <div className="flex flex-col gap-6">
                <ActionCard
                    to="/contests"
                    icon="emoji_events"
                    title="Contests"
                    description="View and participate in contests"
                />
                <ActionCard
                    to="/submission"
                    icon="upload"
                    title="Submit Code"
                    description="Submit to practice problems"
                />
                <ActionCard
                    to="/leaderboard"
                    icon="leaderboard"
                    title="Leaderboard"
                    description="View overall rankings"
                />
            </div>
        </div>
    );
};

export default QuickActions;
