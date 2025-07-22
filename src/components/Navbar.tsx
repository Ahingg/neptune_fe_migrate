import { NavLink } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import {
    userAtom,
    isAuthenticatedAtom,
    isAdminAtom,
    isStudentAtom,
} from '../store/auth'; // Assuming atoms are in src/store/auth.ts
import { useAuth } from '../hooks/useAuth'; // The hook for actions like logout

type NavLinkInfo = {
    to: string;
    label: string;
    roles?: Array<'admin' | 'student'>;
};

const allNavLinks: NavLinkInfo[] = [
    { to: '/dashboard', label: 'Dashboard', roles: ['student', 'admin'] },
    { to: '/contests', label: 'Contests', roles: ['student'] },
    { to: '/submission', label: 'Submission', roles: ['student'] },
    { to: '/leaderboard', label: 'Leaderboard', roles: ['student', 'admin'] },
];

const Navbar: React.FC = () => {
    const user = useAtomValue(userAtom);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const isAdmin = useAtomValue(isAdminAtom);
    const isStudent = useAtomValue(isStudentAtom);
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const visibleNavLinks = allNavLinks.filter((link) => {
        if (!link.roles) return true;
        if (isAdmin && link.roles.includes('admin')) return true;
        if (isStudent && link.roles.includes('student')) return true;
        return false;
    });

    return (
        // Main container now uses a column layout
        <div className="navbar flex-col bg-blue-100 shadow-lg px-8 py-4 gap-4 mb-10">
            {/* Upper Section: Logo and User Info */}
            <div className="w-full flex justify-between items-center">
                {/* Upper Left: Logo */}
                <NavLink
                    to="/dashboard"
                    className="font-extrabold text-3xl text-blue-700 tracking-wide hover:text-blue-900 transition-colors"
                >
                    NEPTUNE
                </NavLink>

                {/* Upper Right: User Info */}
                {isAuthenticated && user && (
                    <div className="text-right">
                        <span className="font-bold text-xl text-blue-800 block">
                            {user.name}
                        </span>
                        <span className="text-md text-gray-600 block">
                            {user.username}
                        </span>
                    </div>
                )}
            </div>

            {/* --- Divider (Optional) --- */}
            <div className="w-full border-b border-blue-500/50"></div>

            {/* Lower Section: Navigation and Logout */}
            <div className="w-full flex justify-between items-center">
                {/* Bottom Left: Navigation Links */}
                <nav className="flex gap-2">
                    {visibleNavLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-blue-100 text-blue-700 shadow-inner'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Right: Logout or Login Button */}
                <div>
                    {isAuthenticated ? (
                        <button
                            className="btn btn-md btn-outline btn-primary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    ) : (
                        <NavLink to="/login" className="btn btn-primary">
                            Login
                        </NavLink>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
