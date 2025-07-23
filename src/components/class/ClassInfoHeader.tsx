import React from 'react';

interface ClassInfoHeaderProps {
    classData: Class | null;
}

const ClassInfoHeader: React.FC<ClassInfoHeaderProps> = ({ classData }) => {
    if (!classData) return null;

    return (
        <div className="bg-blue-50 shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
            <h1 className="text-3xl font-bold text-blue-500">
                {classData.class_name}
            </h1>
            <p className="text-md text-blue-500 mb-4">
                COMP6047001 - Algorithm and Programming
            </p>

            <div className="flex items-center gap-4">
                <span className="material-icons text-blue-500">people</span>
                <div>
                    <h3 className="font-semibold text-blue-700">Assistants</h3>
                    <div className="text-sm text-blue-600">
                        {classData.assistants && classData.assistants.length > 0
                            ? classData.assistants.map((a) => a.name).join(', ')
                            : 'No assistants assigned.'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassInfoHeader;
