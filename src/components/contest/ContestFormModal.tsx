import React, { useState, useEffect } from 'react';
import { useClasses } from '../../hooks/useClasses';
import useCases from '../../hooks/useCases';
import { useSemester } from '../../hooks/useSemester';

interface ContestFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: any, isEdit: boolean, contestId?: string) => Promise<void>;
    loading: boolean;
    initialData?: any;
}

const ContestFormModal: React.FC<ContestFormModalProps> = ({ open, onClose, onSubmit, loading, initialData }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [scope, setScope] = useState('class');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [selectedCases, setSelectedCases] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState<string>('09a7b352-1f11-ec11-90f0-d8d385fce79e');

    const { classes, loading: classesLoading, courseOptions } = useClasses(selectedCourseId);
    const { cases, loading: casesLoading } = useCases();
    const { semester, loading: semesterLoading } = useSemester();

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setScope(initialData.scope || 'class');
            // TODO: set start/end time, selected classes/cases if editing
        } else {
            setName('');
            setDescription('');
            setScope('class');
            setStartTime('');
            setEndTime('');
            setSelectedClasses([]);
            setSelectedCases([]);
        }
        setError('');
    }, [initialData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !scope || !startTime || !endTime || selectedClasses.length === 0 || selectedCases.length === 0) {
            setError('All fields are required.');
            return;
        }
        const formData = {
            name,
            description,
            scope,
            start_time: startTime,
            end_time: endTime,
            class_ids: selectedClasses,
            case_ids: selectedCases,
        };
        await onSubmit(formData, !!initialData, initialData?.id);
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[10px]">
            <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg border-2 border-blue-200 relative">
                <button className="absolute top-3 right-3 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl shadow transition-colors" onClick={onClose}>&times;</button>
                <h2 className="text-2xl font-extrabold text-blue-700 mb-4 drop-shadow">{initialData ? 'Edit Contest' : 'Add New Contest'}</h2>
                {/* DEBUG: Show current semester and class list */}
                <div className="mb-2 p-2 bg-blue-50 rounded text-xs border border-blue-100">
                    <div><b>Current Semester:</b> {semesterLoading ? 'Loading...' : semester ? `${semester.description} (${semester.semester_id})` : 'None'}</div>
                    <div><b>Course:</b> <select className="select select-bordered select-xs border-blue-200 text-white bg-blue-700" value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)}>
                        {courseOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select></div>
                    <div><b>Classes in Semester:</b> {classesLoading ? 'Loading...' : (classes || []).length === 0 ? 'None' : (classes || []).map(cls => `${cls.class_code} (${cls.class_transaction_id})`).join(', ')}</div>
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-800">
                    <input className="input input-bordered border-blue-200 focus:border-blue-400 text-white bg-blue-700 placeholder-blue-200" placeholder="Contest Name" value={name} onChange={e => setName(e.target.value)} />
                    <textarea className="textarea textarea-bordered border-blue-200 focus:border-blue-400 text-white bg-blue-700 placeholder-blue-200" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                    <select className="select select-bordered border-blue-200 focus:border-blue-400 text-white bg-blue-700" value={scope} onChange={e => setScope(e.target.value)}>
                        <option value="class">Class Contest</option>
                        <option value="global">Global Contest</option>
                    </select>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs text-blue-700 mb-1">Start Time</label>
                            <input className="input input-bordered w-full border-blue-200 focus:border-blue-400 text-white placeholder-blue-200" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-blue-700 mb-1">End Time</label>
                            <input className="input input-bordered w-full border-blue-200 focus:border-blue-400 text-white placeholder-blue-200" type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 mb-1">Assign to Classes <span className='text-gray-400'>({(selectedClasses || []).length} selected)</span></label>
                        {classesLoading ? <div>Loading classes...</div> : (
                            <div className="max-h-32 overflow-y-auto border rounded p-2 bg-blue-50 border-blue-100">
                                {(classes || []).length === 0 ? <div className="text-gray-400">No classes available</div> :
                                    (classes || []).map(cls => (
                                        <label key={cls.class_transaction_id} className="flex items-center gap-2 cursor-pointer py-1 text-blue-800">
                                            <input
                                                type="checkbox"
                                                checked={selectedClasses.includes(cls.class_transaction_id)}
                                                onChange={e => {
                                                    if (e.target.checked) setSelectedClasses([...selectedClasses, cls.class_transaction_id]);
                                                    else setSelectedClasses(selectedClasses.filter(id => id !== cls.class_transaction_id));
                                                }}
                                            />
                                            <span>{cls.class_code}</span>
                                        </label>
                                    ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs text-blue-700 mb-1">Assign Cases <span className='text-gray-400'>({(selectedCases || []).length} selected)</span></label>
                        {casesLoading ? <div>Loading cases...</div> : (
                            <div className="max-h-32 overflow-y-auto border rounded p-2 bg-blue-50 border-blue-100">
                                {(cases || []).length === 0 ? <div className="text-blue-800">No cases available</div> :
                                    (cases || []).map((cs: any) => (
                                        <label key={cs.case_id} className="flex items-center gap-2 cursor-pointer py-1 text-blue-800">
                                            <input
                                                type="checkbox"
                                                checked={selectedCases.includes(cs.case_id)}
                                                onChange={e => {
                                                    if (e.target.checked) setSelectedCases([...selectedCases, cs.case_id]);
                                                    else setSelectedCases(selectedCases.filter(id => id !== cs.case_id));
                                                }}
                                            />
                                            <span>{cs.name}</span>
                                        </label>
                                    ))}
                            </div>
                        )}
                    </div>
                    <button className="btn bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 shadow hover:bg-blue-700 transition-colors mt-2" type="submit" disabled={loading}>{loading ? 'Saving...' : (initialData ? 'Update Contest' : 'Create Contest')}</button>
                </form>
            </div>
        </div>
    );
};

export default ContestFormModal;
