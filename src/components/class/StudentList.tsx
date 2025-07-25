import React, { useState, useMemo } from 'react';
import type { UserProfile } from '../../types/auth';

interface StudentListProps {
    students: UserProfile[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAndSortedStudents = useMemo(() => {
        return students
            .filter(
                (student) =>
                    student.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    student.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [students, searchTerm]);

    return (
        <div className="bg-base-200 shadow-lg rounded-2xl p-6 border-1 border-gray-800">
            <div className="flex flex-col justify-between items-center mb-4">
                <div className="w-full">
                    <h4 className="text-xl font-bold text-blue-700 mr-4 mb-2">
                        Enrolled Students ({filteredAndSortedStudents.length})
                    </h4>
                </div>
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="input input-bordered input-sm w-full max-w-xs bg-base-100/50 text-blue-500 placeholder:text-blue-200/50 border-1 border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto h-96">
                <table className="table table-pin-rows table-sm border-collapse rounded-xl">
                    <thead>
                        <tr className="border border-gray-800 bg-base-300 text-blue-500 rounded-tl-xl">
                            <th className="w-12">#</th>
                            <th>Student</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedStudents.map((student, index) => (
                            <tr
                                className="bg-base-100 text-blue-500 border-1 border-gray-800"
                                key={student.user_id}
                            >
                                <th>{index + 1}</th>
                                <td>
                                    <div className="text-md font-bold">
                                        {student.username}
                                    </div>
                                    <div className="text-xs text-blue-300 opacity-50">
                                        {student.name}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default StudentList;
