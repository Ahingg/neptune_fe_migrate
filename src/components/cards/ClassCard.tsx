import React from 'react';
import { Link } from 'react-router-dom';

interface ClassCardProps {
    enrollment: UserEnrollmentDetail;
}

const ClassCard: React.FC<ClassCardProps> = ({ enrollment }) => {
    return (
        <div className="card bg-white border border-blue-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
                <span className="material-icons text-blue-500 text-4xl">
                    class
                </span>
            </div>
            <h3 className="card-title text-lg font-bold text-blue-800 h-14">
                {enrollment.class_name}
            </h3>
            <p className="card-title text-lg font-bold text-blue-500/80 mb-2 h-14">
                COMP6047001 - Algorithm and Programming
            </p>
            <div className="flex gap-2 mt-4">
                <Link
                    to={`/class/${enrollment.class_transaction_id}`}
                    className="btn btn-primary btn-md flex-1 text-lg"
                >
                    View All Contests
                </Link>
            </div>
        </div>
    );
};

export default ClassCard;
