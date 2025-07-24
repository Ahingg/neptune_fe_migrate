import React from 'react';
import type { Class } from '../../types/class';
import type { UserProfile } from '../../types/auth';
import { UserRound } from 'lucide-react';

interface ClassInfoHeaderProps {
    classData: Class | null;
}

const ClassInfoHeader: React.FC<ClassInfoHeaderProps> = ({ classData }) => {
    if (!classData) return null;

    return (
        <div className="bg-base-300 shadow-lg rounded-2xl p-6 border border-gray-600">
            <h1 className="text-3xl font-bold text-blue-700">
                {classData.class_code}
            </h1>
            <p className="text-md text-blue-500/50 mb-4">
                COMP6047001 - Algorithm and Programming
            </p>

            <div className="gap-4 ">
                <div>
                    <h3 className="font-semibold text-blue-700 text-xl">Assistants</h3>
                    {classData.assistants && (
                        <div className="text-sm text-blue-500 w-full">
                            {classData.assistants.map((u: UserProfile) => (
                                <div key={u.user_id} className="flex flex-row justify-center items-center gap-x-2 border border-blue-500 py-4 px-8 w-full">
                                    <UserRound />
                                    <span className='text-blue-500 text-lg font-bold'>({u.username})</span>
                                    <span className="text-lg font-bold">
                                        {u.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassInfoHeader;
