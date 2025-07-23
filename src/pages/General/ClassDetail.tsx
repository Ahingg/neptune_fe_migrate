import React from 'react';
import { useParams } from 'react-router-dom';
import ClassInfoHeader from '../../components/class/ClassInfoHeader';
import StudentList from '../../components/class/StudentList';
import ContestList from '../../components/class/ContestList';
import { useClassDetails } from '../../hooks/useClassDetail';

const ClassDetailPage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const { classData, contests, loading, error } = useClassDetails(classId);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-300">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-300">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <>
            <main className="p-8 bg-base-100 min-h-screen">
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
                    {/* Left Column */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        <ClassInfoHeader classData={classData} />
                        <StudentList students={classData?.students || []} />
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2">
                        <ContestList contests={contests} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default ClassDetailPage;
