import { NavLink } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import {
    userAtom,
    isAuthenticatedAtom,
} from '../store/auth'; // Assuming atoms are in src/store/auth.ts




const Navbar: React.FC = () => {
    const user = useAtomValue(userAtom);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);

    return (
        // Main container now uses a column layout
        <div className="bg-white px-8 py-4 gap-4 z-15 relative">
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

        </div>
    );
};

export default Navbar;
