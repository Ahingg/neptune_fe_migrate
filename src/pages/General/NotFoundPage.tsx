import React from 'react';
import { Link } from 'react-router-dom';
import notFoundImage from '../../assets/not-found.png'; // Make sure you have this image in your assets

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center p-4">
            <img
                src={notFoundImage}
                alt="Page Not Found"
                className="w-96 h-auto opacity-50"
            />
            <h1 className="text-4xl font-bold text-blue-700 mb-2">
                404 - Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-6">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link to="/" className="btn btn-primary">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
