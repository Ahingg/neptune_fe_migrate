import React from 'react';
import Image from '../../../src/assets/neptune_logo.png'

type AuthCardProps = {
    children: React.ReactNode; // The form elements will be passed as children
};

const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
    return (
        <div className="bg-gradient-to-br from-base-100 to-base-300 shadow-xl rounded-lg p-8 w-96 flex flex-col items-center z-10">
            {/* Logo and Branding Section */}
            <div className="mb-6">
                    <img src={Image} alt="nein" className='w-36'/>
                <div className="w-24 h-12 mx-auto mb-2 flex items-center justify-center">
                    <span className="font-bold text-blue-700 text-2xl">
                        NEPTUNE
                    </span>
                </div>
                <div className="text-center text-xs text-gray-500 font-semibold leading-tight">
                    BINUS UNIVERSITY
                    <br />
                    Software Laboratory Center
                </div>
            </div>

            {/* The form itself will be rendered here */}
            {children}

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-gray-500">
                <p>Created With Love By XY and LF</p>
                <p>Software Laboratory Center</p>
            </div>
        </div>
    );
};

export default AuthCard;
