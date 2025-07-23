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
                    to="/cases"
                    icon="description"
                    title="Cases"
                    description="Manage and view all cases"
                />
                <ActionCard
                    to="/classes"
                    icon="class"
                    title="Classes"
                    description="Manage and view all classes"
                />
            </div>
        </div>
    );
};

export default QuickActions;
