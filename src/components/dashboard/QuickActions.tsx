import React from 'react';
import ActionCard from '../cards/ActionCard'; // Assuming ActionCard is styled appropriately

const QuickActions: React.FC = () => {
    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-blue-700  mb-4">
                Quick Actions
            </h3>
            <div className="flex flex-col gap-4">
                <ActionCard
                    to="/contests"
                    icon="emoji_events"
                    title="Contests"
                    description="View and participate in contests"
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
