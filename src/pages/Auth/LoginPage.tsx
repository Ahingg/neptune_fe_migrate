import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import FormInput from '../../components/forms/FormInput';
import AuthCard from '../../components/cards/AuthCard';
import { Navigate, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    // Using the modern auth hook based on Jotai
    const { login, loading, error, clearError, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (error) clearError?.(); // Clear previous errors if the function exists
        setFormError(null);
        if (!username || !password) {
            setFormError("Username and password are required.");
            return;
        }

        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            // Error state is already handled and set by the useAuth hook
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 relative overflow-hidden">
            <link
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet"
            />

            <AuthCard>
                <form
                    className="w-full flex flex-col gap-4"
                    onSubmit={handleSubmit}
                >
                    <FormInput
                        icon="person"
                        type="text"
                        placeholder="NIM/ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        helperText="Enter your BINUS NIM or Admin ID"
                    />

                    <FormInput
                        icon="lock"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        helperText="Your BIMAY or admin account password"
                    />

                    {(formError || error) && (
                        <div
                            role="alert"
                            className="alert alert-error text-sm p-2"
                        >
                            <span className="material-icons text-base">
                                error
                            </span>
                            <span>{formError || error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </AuthCard>
        </div>
    );
};

export default LoginPage;
