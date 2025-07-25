import { useAtomValue } from "jotai";
import { isAdminAtom, isAuthenticatedAtom, isStudentAtom, isLecturerAtom, isAssistantAtom } from "../store/auth";
import { useAuth } from "../hooks/useAuth";
import { NavLink } from "react-router-dom";


type NavLinkInfo = {
    to: string;
    label: string;
    roles?: Array<'Admin' | 'student' | 'Lecturer' | 'Assistant'>;
};
const allNavLinks: NavLinkInfo[] = [
    { to: '/', label: 'Dashboard', roles: ['Admin', 'student','Assistant'] },
    { to: '/contests', label: 'Contests', roles: ['Admin'] },
    { to: '/cases', label: 'Cases', roles: ['Admin'] },
    { to: '/classes', label: 'Classes', roles: ['Admin'] },
    { to: '/lecturer/classes', label: 'Classes', roles: ['Lecturer', 'Assistant'] },
    { to: '/lecturer/contests', label: 'Contests', roles: ['Lecturer', 'Assistant'] },
    { to: '/lecturer/submissions', label: 'Submissions', roles: ['Lecturer', 'Assistant'] },
    { to: '/lecturer/leaderboard', label: 'Leaderboard', roles: ['Lecturer', 'Assistant'] },
    { to: '/leaderboard', label: 'Leaderboard', roles: ['student', 'Admin'] },
];



const NavbarBottom: React.FC = () => {
    const isAdmin = useAtomValue(isAdminAtom);
    const isStudent = useAtomValue(isStudentAtom);
    const isLecturer = useAtomValue(isLecturerAtom);
    const isAssistant = useAtomValue(isAssistantAtom);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);

    const { logout } = useAuth();

    const visibleNavLinks = allNavLinks.filter((link) => {
        if (!link.roles) return true;
        if (isAdmin && link.roles.includes('Admin')) return true;
        if (isStudent && link.roles.includes('student')) return true;
        if (isLecturer && link.roles.includes('Lecturer')) return true;
        if (isAssistant && link.roles.includes('Assistant')) return true;
        return false;
    });
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    return (
        <>
            {/* Lower Section: Navigation and Logout */}
            <div className="w-full flex justify-between items-center sticky top-0 px-8 bg-white navbar shadow-lg border-t-1 border-t-blue-500 z-20">
                {/* Bottom Left: Navigation Links */}
                <nav className="flex gap-2">
                    {visibleNavLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${isActive
                                    ? 'bg-blue-100 text-blue-700 shadow-inner'
                                    : 'text-gray-700 hover:bg-blue-500 hover:text-blue-50'
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
        </>
    );
}

export default NavbarBottom;
