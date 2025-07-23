import React from 'react';
import { useParams } from 'react-router-dom';
import useClassDetail from '../../hooks/useClassDetail';
import StudentList from '../../components/class/StudentList';

const LecturerClassPage: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const { classData, loading, error } = useClassDetail(classId);

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white rounded-xl shadow p-6">
                {loading && <div className="text-gray-800">Loading...</div>}
                {error && <div className="text-red-700 text-gray-800">{error}</div>}
                {classData && (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {classData.class_code} - {classData.class_name}
                        </h1>
                        <div className="mb-2 text-gray-800">
                            <b>Course:</b> {classData.course_outline_id}
                        </div>
                        <div className="mb-2 text-gray-800">
                            <b>Students ({(classData.students || []).length}):</b>
                        </div>
                        <StudentList students={classData.students || []} />
                    </>
                )}
            </div>
        </div>
    );
};

export default LecturerClassPage;
