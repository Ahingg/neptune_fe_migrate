import React from 'react';
import type { Class } from '../../types/class';
import type { Semester } from '../../types/semester';

interface ClassListPanelProps {
    semesters: Semester[];
    selectedSemester: string;
    onSemesterChange: (semesterId: string) => void;
    classes: Class[];
    selectedClass: Class | null;
    onSelectClass: (cls: Class) => void;
    loading: boolean;
    error: string | null;
}

const ClassListPanel: React.FC<ClassListPanelProps> = ({
    semesters,
    selectedSemester,
    onSemesterChange,
    classes,
    selectedClass,
    onSelectClass,
    loading,
    error,
}) => {
    return (
        <div className="bg-base-300 border border-gray-600 rounded-xl shadow p-6 h-full flex flex-col">
            <h2 className="text-3xl font-bold mb-4 text-blue-700">
                My Assistant Classes
            </h2>

            <label className="block text-xl mb-2 text-blue-500">
                Select Semester:
            </label>
            <select
                className="select select-bordered w-full mb-4 text-white bg-base-100"
                value={selectedSemester}
                onChange={(e) => onSemesterChange(e.target.value)}
                disabled={loading}
            >
                {semesters.map((s) => (
                    <option
                        key={s.semester_id}
                        value={s.semester_id}
                        className="text-gray-100 bg-base-200"
                    >
                        {s.description}
                    </option>
                ))}
            </select>

            <div className="mb-2 text-blue-500 font-semibold text-2xl">
                Class List:
            </div>
            <div className="flex-grow min-h-0 overflow-y-auto pr-2">
                {loading ? (
                    <div className="text-center p-4">
                        <span className="loading loading-spinner"></span>
                    </div>
                ) : error ? (
                    <div className="alert alert-error">{error}</div>
                ) : classes.length === 0 ? (
                    <div className="text-center p-4 text-gray-400">
                        No classes found for this semester.
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {classes.map((cls) => (
                            <li key={cls.class_transaction_id}>
                                <button
                                    onClick={() => onSelectClass(cls)}
                                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                                        selectedClass?.class_transaction_id ===
                                        cls.class_transaction_id
                                            ? 'bg-base-100 text-gray-100 border-gray-400 scale-[101%] shadow-lg'
                                            : 'bg-base-200/50 hover:bg-base-100/50 text-gray-300 hover:text-white border-gray-600'
                                    }`}
                                >
                                    <div className="font-semibold">
                                        {cls.class_code}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ClassListPanel;
