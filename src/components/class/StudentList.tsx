import React from 'react';
import type { UserProfile } from '../../types/auth';

const StudentList: React.FC<{ students: UserProfile[] }> = ({ students }) => (
    <ul className="list-disc list-inside">
        {students.map(s => (
            <li key={s.user_id} className="text-gray-800">{s.name} ({s.username})</li>
        ))}
        {students.length === 0 && <li className="text-gray-400">No students found.</li>}
    </ul>
);

export default StudentList;
