import React, { useEffect, useState } from 'react';
import { getAllSemestersApi, getCurrentSemesterApi } from '../../api/semester';
import { getAllClassesBySemesterIdApi, getClassByIdApi } from '../../api/class';
import { getMeApi } from '../../api/auth';
import StudentList from '../../components/class/StudentList';
import useClassContests from '../../hooks/useClassContests';
import type { Semester } from '../../types/semester';
import type { Class } from '../../types/class';

const DEFAULT_COURSE_ID = '09a7b352-1f11-ec11-90f0-d8d385fce79e';

const COURSE_NAMES: Record<string, string> = {
    '09a7b352-1f11-ec11-90f0-d8d385fce79e': 'Algorithm and Programming',
};

const LecturerClassesPage: React.FC = () => {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string>('');
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Fetch all semesters and current semester on mount
    useEffect(() => {
        const fetchSemesters = async () => {
            setLoading(true);
            try {
                const [all, current, me] = await Promise.all([
                    getAllSemestersApi(),
                    getCurrentSemesterApi(),
                    getMeApi(),
                ]);
                setSemesters(all);
                setCurrentSemester(current);
                setSelectedSemester(current.semester_id);
                setUserId(me.user.id);
            } catch (e: any) {
                setError(e.message || 'Failed to fetch semesters');
            } finally {
                setLoading(false);
            }
        };
        fetchSemesters();
    }, []);

    // Fetch classes when selected semester changes
    useEffect(() => {
        if (!selectedSemester || !userId) return;
        setClasses([]);
        setSelectedClass(null);
        setLoading(true);
        setError(null);

        getAllClassesBySemesterIdApi(selectedSemester, DEFAULT_COURSE_ID)
            .then(async (allClasses) => {
                console.log(`Found ${allClasses.length} total classes for semester ${selectedSemester}`);

                // Fetch class details for each class
                const details = await Promise.all(
                    allClasses.map(cls => getClassByIdApi(cls.class_transaction_id))
                );

                // Filter for classes where user is an assistant
                const filtered = details.filter(cls => {
                    const isAssistant = (cls.assistants || []).some((a: any) => a.user_id === userId);
                    if (isAssistant) {
                        console.log(`User is assistant for class: ${cls.class_code}`);
                    }
                    return isAssistant;
                });

                console.log(`User is assistant for ${filtered.length} out of ${details.length} classes`);
                setClasses(filtered);

                // Auto-select first class if available
                if (filtered.length > 0) {
                    setSelectedClass(filtered[0]);
                }

                if (filtered.length === 0 && details.length > 0) {
                    setError(`You are not assigned as an assistant for any classes in the selected semester. Total classes in semester: ${details.length}`);
                }
            })
            .catch(e => {
                console.error('Error fetching classes:', e);
                setError(e.message || 'Failed to fetch classes');
            })
            .finally(() => setLoading(false));
    }, [selectedSemester, userId]);

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-8 h-[800px]">
                {/* Left Box: Semester dropdown and class list */}
                <div className="lg:w-1/2 w-full bg-blue-50 rounded-xl shadow p-6 h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">My Assistant Classes</h2>
                    {loading ? (
                        <div className="text-gray-800">Loading semesters...</div>
                    ) : (
                        <>
                            <label className="block mb-2 text-gray-800">Select Semester:</label>
                            <select
                                className="select select-bordered w-full mb-4 text-white bg-blue-700"
                                value={selectedSemester}
                                onChange={e => setSelectedSemester(e.target.value)}
                            >
                                {semesters.map(s => (
                                    <option key={s.semester_id} value={s.semester_id} className="text-white bg-blue-700">
                                        {s.description}
                                    </option>
                                ))}
                            </select>

                            <div className="mb-2 text-gray-800 font-semibold">Class List:</div>
                            <div className="flex-1 min-h-0 overflow-y-auto">
                                {error ? (
                                    <div className="text-red-600 bg-red-50 p-3 rounded-lg">
                                        {error}
                                    </div>
                                ) : classes.length === 0 ? (
                                    <div className="text-gray-400">No classes found for this semester.</div>
                                ) : (
                                    <ul className="space-y-2">
                                        {classes.map(cls => (
                                            <li key={cls.class_transaction_id}>
                                                <button
                                                    onClick={() => setSelectedClass(cls)}
                                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedClass?.class_transaction_id === cls.class_transaction_id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white hover:bg-blue-100 text-gray-800'
                                                        }`}
                                                >
                                                    <div className="font-semibold">{cls.class_code}</div>
                                                    {/* <div className="text-sm opacity-75">{cls.class_name || 'No name'}</div> */}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Right Box: Class details */}
                <div className="lg:w-1/2 w-full bg-white rounded-xl shadow p-6 h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Class Details</h2>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        {selectedClass ? (
                            <ClassDetailContent selectedClass={selectedClass} />
                        ) : (
                            <div className="text-gray-400 text-center mt-8">
                                Select a class to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// New component for class detail content with contests
const ClassDetailContent: React.FC<{ selectedClass: Class }> = ({ selectedClass }) => {
    const { contests, loading, error } = useClassContests(selectedClass.class_transaction_id);
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                <h3 className="text-2xl font-extrabold text-blue-700 mb-2 drop-shadow">{selectedClass.class_code}</h3>
                <div className="text-blue-700 font-semibold mb-2">
                    Course: <span className="font-normal text-gray-800">{COURSE_NAMES[selectedClass.course_outline_id] || selectedClass.course_outline_id}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="text-blue-700 font-semibold mb-1">Students <span className="text-xs text-gray-500">({(selectedClass.students || []).length})</span></div>
                        <div className="bg-blue-50 rounded-xl p-3 mb-4 shadow-inner">
                            <StudentList
                                students={(selectedClass.students || []).map(s =>
                                    s.name && s.username
                                        ? s
                                        : s.User
                                            ? { user_id: s.User.ID, name: s.User.Name, username: s.User.Username }
                                            : { user_id: '', name: '', username: '' }
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="text-blue-700 font-semibold mb-1">Assistants <span className="text-xs text-gray-500">({(selectedClass.assistants || []).length})</span></div>
                        <div className="bg-blue-50 rounded-xl p-3 mb-4 shadow-inner">
                            <ul className="space-y-1">
                                {(selectedClass.assistants || []).map((assistant: any) => (
                                    <li key={assistant.user_id || assistant.UserID} className="text-gray-800">
                                        {(assistant.name || (assistant.User && assistant.User.Name))} ({assistant.username || (assistant.User && assistant.User.Username)})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* Contests Assigned Box */}
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl shadow-lg p-6 border border-blue-200">
                <div className="text-blue-700 font-bold text-lg mb-3">Contests Assigned</div>
                {loading ? (
                    <div className="text-gray-500">Loading contests...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : contests.length === 0 ? (
                    <div className="text-gray-400">No contests assigned to this class.</div>
                ) : (
                    <ul className="space-y-2">
                        {contests.map(contest => (
                            <li key={contest.contest_id}>
                                <button
                                    onClick={() => window.location.href = '/lecturer/contests'}
                                    className="w-full text-left p-3 rounded-lg transition-colors font-semibold text-blue-800 bg-white hover:bg-blue-100 shadow border border-blue-200"
                                >
                                    {contest.contest?.name || 'Unnamed Contest'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LecturerClassesPage;
