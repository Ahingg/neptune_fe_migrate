
import React, { Suspense } from 'react';
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/General/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import NavbarBottom from './components/NavbarBottom';
import ClassDetailPage from './pages/General/ClassDetail';
import ContestCasesPage from './pages/General/ContestCasesPage';
import CasePage from './pages/General/CasePage'; // fallback for eager load if needed
import ContestPage from './pages/General/ContestPage';
import ClassPage from './pages/General/ClassPage';
import LeaderboardPage from './pages/General/LeaderboardPage';
import LecturerDashboardPage from './pages/Lecturer/LecturerDashboardPage';
import LecturerClassesPage from './pages/Lecturer/LecturerClassesPage';
import LecturerContestsPage from './pages/Lecturer/LecturerContestsPage';
import LecturerSubmissionsPage from './pages/Lecturer/LecturerSubmissionsPage';
import LecturerLeaderboardPage from './pages/Lecturer/LecturerLeaderboardPage';
import LecturerSubmissionDetailPage from './pages/Lecturer/LecturerSubmissionDetailPage';
import AdminSubmissionDetailPage from './pages/General/AdminSubmissionDetailPage';
import AdminLeaderboardPage from './pages/General/LeaderboardPage';

// todo: Adjust Unauthorized and Not Found Page
const UnauthorizedPage: React.FC = () => (
    <div className="container mx-auto p-4 text-error">
        You are not authorized to view this page.
    </div>
);

const App: React.FC = () => {
    const location = useLocation();

    return (
        <>
            {location.pathname !== '/login' && (
                <>
                    <Navbar />
                    <NavbarBottom />
                </>
            )}
            <main className="">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/unauthorized"
                        element={<UnauthorizedPage />}
                    />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<DashboardPage />} />
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
                            path="/leaderboard"
                            element={<AdminLeaderboardPage />}
                        />
                    </Route>
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
                    <Route element={<ProtectedRoute allowedRoles={['Lecturer', 'Assistant']} />}>
                        <Route path="/lecturer/dashboard" element={<LecturerDashboardPage />} />
                        <Route path="/lecturer/classes" element={<LecturerClassesPage />} />
                        <Route path="/lecturer/contests" element={<LecturerContestsPage />} />
                        <Route path="/lecturer/submissions" element={<LecturerSubmissionsPage />} />
                        <Route path="/lecturer/leaderboard" element={<LecturerLeaderboardPage />} />
                        {/* <Route path="/lecturer/submissionDetail" element={<LecturerSubmissionDetailPage />} /> */}
                        <Route path="/lecturer/submission-detail" element={<LecturerSubmissionDetailPage />} />
                    </Route>
                    <Route
                        path="*"
                        element={
                            <div className="container mx-auto p-4">
                                <h1>404 - Page Not Found</h1>
                            </div>
                        }
                    />
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
