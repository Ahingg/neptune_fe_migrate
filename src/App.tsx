
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/General/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import NavbarBottom from './components/NavbarBottom';
import ClassDetailPage from './pages/General/ClassDetail';

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
                        <Route path="/class/:classId" element={<ClassDetailPage />} />
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

const AppWrapper: React.FC = () =>(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default AppWrapper;
