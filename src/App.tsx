
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/Auth/LoginPage';

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
           {location.pathname !== '/login' && <Navbar />}
            <main className="">
                <Routes>
                    {/* <Route path='/' element={<LoginPage />} /> */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/unauthorized"
                        element={<UnauthorizedPage />}
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
