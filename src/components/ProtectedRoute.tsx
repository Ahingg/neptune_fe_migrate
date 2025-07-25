// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    allowedRoles?: ('Admin' | 'Student' | 'Assistant' | 'Lecturer')[];
}

/**
 * ProtectedRoute component acts as a route guard.
 * It checks authentication status and user roles before rendering child routes.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth(); // Get auth state from custom hook
    
    // Show a loading spinner while authentication status is being determined
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="ml-4 text-xl">Loading user data...</p>
            </div>
        );
    }

    // If not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If roles are specified and the user's role is not allowed, redirect to unauthorized page
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If authenticated and authorized, render the child routes (via <Outlet />)
    return <Outlet />;
};

export default ProtectedRoute;
