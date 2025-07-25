import React from 'react';
import { Link } from 'react-router-dom';
import unauthorizedImage from '../../assets/unauthorized.png'; // Make sure you have this image in your assets

const UnauthorizedPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center p-4">
            <img
                src={unauthorizedImage}
                alt="Unauthorized Access"
                className="w-64 h-auto mb-8 opacity-25"
            />
            <h1 className="text-4xl font-bold text-red-600 mb-2">
                403 - Access Denied
            </h1>
            <p className="text-lg text-gray-600 mb-6">
                You do not have the necessary permissions to view this page.
            </p>
            <Link to="/" className="btn btn-primary">
                Return to Dashboard
            </Link>
        </div>
    );
};

export default UnauthorizedPage;
