import React, { Suspense } from 'react';
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import NavbarBottom from './components/NavbarBottom';
import DashboardRedirector from './pages/General/DashboardRedirector';
import ClassDetailPage from './pages/General/ClassDetail';
import ContestCasesPage from './pages/General/ContestCasesPage';
import LeaderboardPage from './pages/General/LeaderboardPage';
import CasePage from './pages/General/CasePage';
import ContestPage from './pages/General/ContestPage';
import ClassPage from './pages/General/ClassPage';
import LecturerClassesPage from './pages/Lecturer/LecturerClassesPage';
import LecturerContestsPage from './pages/Lecturer/LecturerContestsPage';
import LecturerSubmissionsPage from './pages/Lecturer/LecturerSubmissionsPage';
import LecturerLeaderboardPage from './pages/Lecturer/LecturerLeaderboardPage';
import LecturerSubmissionDetailPage from './pages/Lecturer/LecturerSubmissionDetailPage';
import AdminSubmissionDetailPage from './pages/General/AdminSubmissionDetailPage';
import NotFoundPage from './pages/General/NotFoundPage';
import UnauthorizedPage from './pages/General/UnauthorizedPage';
import AdminLeaderboardPage from './pages/Admin/AdminLeaderboardPage';

const App: React.FC = () => {
    const location = useLocation();
    // These pages should not have the main Navbar
    const noNavRoutes = ['/login'];
    const showNav = !noNavRoutes.includes(location.pathname)

    return (
        <>
            {showNav && (
                <>
                    <Navbar />
                    <NavbarBottom />
                </>
            )}
            <main>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Use the new UnauthorizedPage component */}
                    <Route
                        path="/unauthorized"
                        element={<UnauthorizedPage />}
                    />

                    {/* GENERAL PROTECTED ROUTES */}
                    {/* Main protected routes */}
                    <Route element={<ProtectedRoute />}>
                        {/* The main '/' route now uses the redirector */}
                        <Route path="/" element={<DashboardRedirector />} />

                        <Route
                            path="/class/:classId"
                            element={<ClassDetailPage />}
                        />
                        <Route
                            path="/class/:classId/contest/:contestId"
                            element={<ContestCasesPage />}
                        />
                        <Route
                            path="/class/:classId/contest/:contestId/leaderboard"
                            element={<LeaderboardPage />}
                        />

                        <Route
                            path="/contest/global/:contestId"
                            element={<ContestCasesPage />}
                        />
                        <Route
                            path="/contest/:contestId/leaderboard"
                            element={<LeaderboardPage />}
                        />
                        <Route
                            path="/leaderboard"
                            element={<AdminLeaderboardPage />}
                        />
                    </Route>

                    {/* Admin protected routes */}
                    <Route
                        element={<ProtectedRoute allowedRoles={['Admin']} />}
                    >
                        <Route
                            path="/cases"
                            element={
                                <Suspense fallback={<div>Loading...</div>}>
                                    <CasePage />
                                </Suspense>
                            }
                        />
                        <Route
                            path="/contests"
                            element={
                                <Suspense fallback={<div>Loading...</div>}>
                                    <ContestPage />
                                </Suspense>
                            }
                        />
                        <Route
                            path="/classes"
                            element={
                                <Suspense fallback={<div>Loading...</div>}>
                                    <ClassPage />
                                </Suspense>
                            }
                        />
                        <Route
                            path="/general/admin-submission-detail"
                            element={<AdminSubmissionDetailPage />}
                        />
                    </Route>

                    {/* Lecturer/Assistant protected routes */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={['Lecturer', 'Assistant']}
                            />
                        }
                    >
                        {/* Note: The main lecturer dashboard is handled by the redirector at '/' */}
                        <Route
                            path="/lecturer/classes"
                            element={<LecturerClassesPage />}
                        />
                        <Route
                            path="/lecturer/contests"
                            element={<LecturerContestsPage />}
                        />
                        <Route
                            path="/lecturer/submissions"
                            element={<LecturerSubmissionsPage />}
                        />
                        <Route
                            path="/lecturer/leaderboard"
                            element={<LecturerLeaderboardPage />}
                        />
                        <Route
                            path="/lecturer/submission-detail"
                            element={<LecturerSubmissionDetailPage />}
                        />
                    </Route>

                    {/* Use the new NotFoundPage component for any unmatched route */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </>
    );
};

// The BrowserRouter wrapper remains the same
const AppWrapper: React.FC = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default AppWrapper;
