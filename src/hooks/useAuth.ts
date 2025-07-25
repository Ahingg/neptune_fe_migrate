import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { userAtom } from '../store/auth.ts';
import { loginApi, logoutApi, getMeApi } from '../api/auth';
import type { LoginRequest } from '../types/auth';


/**
 * Custom hook for managing user authentication state and actions.
 * Provides user data, loading status, errors, and login/logout functions.
 */
export const useAuth = () => {
    const [user, setUser] = useAtom(userAtom); // State for current user
    const [loading, setLoading] = useState(true); // Loading state for initial auth check
    const [error, setError] = useState<string | null>(null); // Error state for login/logout

    /**
     * Fetches user data from the /auth/me endpoint.
     * This is called on app load and after successful login to populate user state.
     */
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null); // Clear previous errors
            const userData = await getMeApi();
            setUser(userData.user); // Update Jotai atom
        } catch (err: any) {
            // A 401 error is expected if the user is not authenticated (e.g., first visit, expired cookie)
            console.log(
                'User not authenticated or session expired:',
                err.response?.status
            );
            setUser(null); // Clear user state if fetching fails
            // Don't set a general error here, as it's normal behavior for unauthenticated state.
        } finally {
            setLoading(false);
        }
    }, [setUser]);

    // Effect to run fetchUser once on component mount (initial auth check)
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    /**
     * Handles user login.
     * @param credentials Username and password.
     */
    const login = async (credentials: LoginRequest) => {
        try {
            setError(null); // Clear previous errors
            await loginApi(credentials); // Send login request
            // Backend sets HTTP-only cookie. We don't get JWT back in response body.
            // So, we immediately re-fetch user data to populate our frontend state.
            await fetchUser(); // Update user state after successful cookie set
        } catch (err: any) {
            console.error('Login error:', err);
            setError(
                err.response?.data?.error ||
                    'Login failed. Please check your credentials.'
            );
            throw err; // Re-throw error to allow calling component to handle specific login failures
        }
    };

    /**
     * Handles user logout.
     */
    const logout = async () => {
        try {
            setError(null); // Clear previous errors
            await logoutApi(); // Send logout request
            setUser(null); // Clear user state in Jotai
        } catch (err: any) {
            console.error('Logout error:', err);
            setError(err.response?.data?.error || 'Logout failed.');
        }
    };

    /**
     * Clears the current error state.
     * Useful for clearing errors before retrying login.
     */
    const clearError = () => {
        setError(null);
    };

    // Return current auth state and actions
    return { user, loading, error, clearError, login, logout, isAuthenticated: !!user };
};
