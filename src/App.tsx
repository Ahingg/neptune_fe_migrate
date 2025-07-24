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
import AdminSubmissionDetailPage from './pages/General/AdminSubmissionDetailPage';
import LecturerClassesPage from './pages/Lecturer/LecturerClassesPage';
import LecturerContestsPage from './pages/Lecturer/LecturerContestsPage';
import LecturerSubmissionsPage from './pages/Lecturer/LecturerSubmissionsPage';
import LecturerLeaderboardPage from './pages/Lecturer/LecturerLeaderboardPage';
import LecturerSubmissionDetailPage from './pages/Lecturer/LecturerSubmissionDetailPage';
import NotFoundPage from './pages/General/NotFoundPage';
import UnauthorizedPage from './pages/General/UnauthorizedPage';

const App: React.FC = () => {
    const location = useLocation();
    const noNavRoutes = ['/login', '/unauthorized'];
    const showNav =
        !noNavRoutes.includes(location.pathname) &&
        !location.pathname.startsWith('/404');

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
                    <Route
                        path="/unauthorized"
                        element={<UnauthorizedPage />}
                    />

                    {/* GENERAL PROTECTED ROUTES */}
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
                    </Route>

                    {/* ADMIN PROTECTED ROUTES */}
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

                    {/* LECTURER & ASSISTANT PROTECTED ROUTES */}
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

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </>
    );
};

const AppWrapper: React.FC = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default AppWrapper;
