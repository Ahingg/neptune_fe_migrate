import React from 'react';
import { Link } from 'react-router-dom';

interface ClassCardProps {
    class_transaction_id: string
    class_name: string
}

const ClassCard: React.FC<ClassCardProps> = ({ class_transaction_id, class_name }: ClassCardProps) => {
    return (
        <div className="card bg-base-200 border border-gray-500 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
                <span className="material-icons text-blue-500 text-4xl">
                    class
                </span>
            </div>
            <h3 className="card-title text-lg font-bold text-blue-800 h-14">
                {class_name}
            </h3>
            <p className="card-title text-lg font-bold text-blue-500/80 mb-2 h-14">
                COMP6047001 - Algorithm and Programming
            </p>
            <div className="flex gap-2 mt-4">
                <Link
                    to={`/class/${class_transaction_id}`}
                    className="btn btn-primary btn-md flex-1 text-lg"
                >
                    View All Contests
                </Link>
            </div>
        </div>
    );
};

export default ClassCard;
