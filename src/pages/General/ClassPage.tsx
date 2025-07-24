import React, { useEffect, useState } from 'react';
import { getAllSemestersApi, getCurrentSemesterApi } from '../../api/semester';
import { getAllClassesBySemesterIdApi, getClassByIdApi } from '../../api/class';
import type { Semester } from '../../types/semester';
import type { Class } from '../../types/class';

const DEFAULT_COURSE_ID = '09a7b352-1f11-ec11-90f0-d8d385fce79e'; // Algorithm and Programming 1

const ClassPage: React.FC = () => {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string>('');
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [classDetail, setClassDetail] = useState<Class | null>(null);
    const [loading, setLoading] = useState(true);
    const [classLoading, setClassLoading] = useState(false);

    // Fetch all semesters and current semester on mount
    useEffect(() => {
        const fetchSemesters = async () => {
            setLoading(true);
            const [all, current] = await Promise.all([
                getAllSemestersApi(),
                getCurrentSemesterApi(),
            ]);
            setSemesters(all);
            setCurrentSemester(current);
            setSelectedSemester(current.semester_id);
            setLoading(false);
        };
        fetchSemesters();
    }, []);

    // Fetch classes when selected semester changes
    useEffect(() => {
        if (!selectedSemester) return;
        setClasses([]);
        setClassDetail(null);
        setClassLoading(true);
        getAllClassesBySemesterIdApi(selectedSemester, DEFAULT_COURSE_ID)
            .then((cls) => setClasses(cls))
            .finally(() => setClassLoading(false));
    }, [selectedSemester]);

    // Fetch class detail when selected class changes
    useEffect(() => {
        if (!selectedClassId) {
            setClassDetail(null);
            return;
        }
        setClassLoading(true);
        getClassByIdApi(selectedClassId)
            .then((detail) => setClassDetail(detail))
            .finally(() => setClassLoading(false));
    }, [selectedClassId]);

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
                {/* Left Box: Semester dropdown and class list */}
                <div className="md:w-1/2 w-full bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-2xl shadow-2xl p-8 flex flex-col h-[900px] border border-blue-100">
                    <h2 className="text-2xl font-extrabold text-blue-700 mb-4 drop-shadow">Classes by Semester</h2>
                    {loading ? (
                        <div className="text-gray-800">Loading semesters...</div>
                    ) : (
                        <>
                            <label className="block mb-2 text-blue-700 font-semibold">Select Semester:</label>
                            <select
                                className="select select-bordered w-full mb-4 text-blue-800 bg-white border-blue-200"
                                value={selectedSemester}
                                onChange={e => setSelectedSemester(e.target.value)}
                            >
                                {semesters.map(s => (
                                    <option key={s.semester_id} value={s.semester_id} className="text-blue-800 bg-white">{s.description}</option>
                                ))}
                            </select>
                            <div className="mb-2 text-blue-700 font-semibold">Class List:</div>
                            <div className="flex-1 min-h-0">
                                {classLoading ? (
                                    <div className="text-gray-800">Loading classes...</div>
                                ) : (
                                    <ul className="divide-y divide-blue-100 h-full overflow-y-auto">
                                        {classes.length === 0 ? (
                                            <li className="text-gray-400">No classes found for this semester.</li>
                                        ) : (
                                            classes.map(cls => (
                                                <li
                                                    key={cls.class_transaction_id}
                                                    className={`py-2 px-2 rounded cursor-pointer hover:bg-blue-100 text-blue-800 font-semibold transition-colors ${selectedClassId === cls.class_transaction_id ? 'bg-blue-200 font-bold' : ''}`}
                                                    onClick={() => setSelectedClassId(cls.class_transaction_id)}
                                                >
                                                    {cls.class_code}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {/* Right Box: Class details */}
                <div className="md:w-1/2 w-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col h-[900px] border border-blue-100">
                    <h2 className="text-2xl font-extrabold text-blue-700 mb-4 drop-shadow">Class Details</h2>
                    {classLoading ? (
                        <div className="text-gray-800">Loading class details...</div>
                    ) : !classDetail ? (
                        <div className="text-gray-400">Select a class to see details.</div>
                    ) : (
                        <>
                            <div className="mb-2 text-blue-700 font-semibold"><b>Class Name:</b> <span className="text-gray-800 font-normal">{classDetail.class_code}</span></div>
                            <div className="mb-2 text-blue-700 font-semibold"><b>Students</b> <span className="text-xs text-gray-500">({(classDetail.students || []).length})</span></div>
                            <ul className="mb-4 list-disc list-inside bg-blue-50 rounded-xl p-3 shadow-inner">
                                {(classDetail.students || []).map((s: any) => (
                                    <li key={s.UserID} className="text-gray-800">{s.User?.Name} ({s.User?.Username})</li>
                                ))}
                            </ul>
                            <div className="mb-2 text-blue-700 font-semibold"><b>Assistants</b> <span className="text-xs text-gray-500">({(classDetail.assistants || []).length})</span></div>
                            <ul className="list-disc list-inside bg-blue-50 rounded-xl p-3 shadow-inner">
                                {(classDetail.assistants || []).map((a: any) => (
                                    <li key={a.UserID} className="text-gray-800">{a.User?.Name} ({a.User?.Username})</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassPage;
