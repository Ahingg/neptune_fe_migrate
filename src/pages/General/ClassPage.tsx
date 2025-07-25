import React, { useEffect, useState } from 'react';
import { getAllClassesBySemesterIdApi, getClassByIdApi } from '../../api/class';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import type { Class } from '../../types/class';
import { RefreshCcw } from 'lucide-react';
import { useSemesters } from '../../hooks/useSemester';

const DEFAULT_COURSE_ID = '09a7b352-1f11-ec11-90f0-d8d385fce79e';

const ClassPage: React.FC = () => {
    const { currentSemester ,semesters } = useSemesters();
    const [selectedSemester, setSelectedSemester] = useState<string>('');
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    
    useEffect(() => {
        if (semesters.length > 0) {
            
            setSelectedSemester(currentSemester?.semester_id ?? semesters[0].semester_id);
        }
    }, [semesters]);
    useEffect(() => {
        if (!selectedSemester) return;
        setLoading(true);
        getAllClassesBySemesterIdApi(selectedSemester, DEFAULT_COURSE_ID)
            .then((cls) => {
                setClasses(cls);
                if (cls.length > 0)
                    handleSelectClass(cls[0].class_transaction_id);
                else setSelectedClass(null);
            })
            .catch(() => setError('Failed to load classes for semester.'))
            .finally(() => setLoading(false));
    }, [selectedSemester]);

    const handleSelectClass = (classId: string) => {
        setLoading(true);
        getClassByIdApi(classId)
            .then((detail) => setSelectedClass(detail))
            .catch(() => setError('Failed to load class details.'))
            .finally(() => setLoading(false));
    };

    return (
        <AdminPageLayout title="Class Browser" error={error}>
            <div className="mb-4">
                <label className="label">
                    <span className="label-text text-blue-500">Semester</span>
                </label>
                <select
                    className="select select-bordered w-full bg-base-100"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                >
                    {semesters.map((s) => (
                        <option key={s.semester_id} value={s.semester_id}>
                            {s.description}
                        </option>
                    ))}
                </select>
            </div>
            <div
                className="flex flex-col md:flex-row gap-6"
                style={{ minHeight: '60vh' }}
            >
                <div className="md:w-1/3 bg-base-100/50 p-4 rounded-lg border border-gray-600">
                    <h3 className="font-bold text-blue-500 mb-2">Classes</h3>
                    <ul className="space-y-2 max-h-[55vh] overflow-y-auto pr-2">
                        {loading ? (
                            <li>Loading...</li>
                        ) : classes ? (
                            classes.map((cls) => (
                                <li key={cls.class_transaction_id}>
                                    <button
                                        onClick={() =>
                                            handleSelectClass(
                                                cls.class_transaction_id
                                            )
                                        }
                                        className={`w-full text-left p-2 rounded-md text-sm ${
                                            selectedClass?.class_transaction_id ===
                                            cls.class_transaction_id
                                                ? 'bg-blue-700 text-white'
                                                : 'bg-base-200 hover:bg-base-100'
                                        }`}
                                    >
                                        {cls.class_code}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <div className="text-error">
                                <span className='block'>No Data for This Semester.</span>

                                <button className="btn btn-info" disabled>
                                    Try Sync <RefreshCcw />
                                </button>
                            </div>
                        )}
                    </ul>
                </div>
                <div className="md:w-2/3 bg-base-100/50 p-4 rounded-lg border border-gray-600">
                    {loading && !selectedClass ? (
                        <div className="text-center p-8">
                            <span className="loading loading-spinner"></span>
                        </div>
                    ) : !selectedClass ? (
                        <div className="text-center p-8 text-gray-400">
                            Select a class to view details.
                        </div>
                    ) : (
                        <ClassDetailsView classDetail={selectedClass} />
                    )}
                </div>
            </div>
        </AdminPageLayout>
    );
};

const ClassDetailsView: React.FC<{ classDetail: Class }> = ({
    classDetail,
}) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-500">
            {classDetail.class_code}
        </h3>
        <div>
            <h4 className="font-semibold">
                Assistants ({classDetail.assistants?.length || 0})
            </h4>
            <ul className="list-disc list-inside text-sm">
                {classDetail.assistants?.map((a: any) => (
                    <li key={a.user_id}>{a.name}</li>
                ))}
            </ul>
        </div>
        <div>
            <h4 className="font-semibold">
                Students ({classDetail.students?.length || 0})
            </h4>
            <ul className="list-disc list-inside text-sm max-h-96 overflow-y-auto">
                {classDetail.students?.map((s: any) => (
                    <li key={s.user_id}>{s.name}</li>
                ))}
            </ul>
        </div>
    </div>
);

export default ClassPage;
