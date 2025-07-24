import React, { useState, useEffect } from 'react';
import { useClasses } from '../../hooks/useClasses';
import useCases from '../../hooks/useCases';
import ClassSelector from '../adminContest/ClassSelector';
import CaseSelector from '../adminContest/CaseSelector';
import { X } from 'lucide-react';
interface ContestFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (
        formData: any,
        isEdit: boolean,
        contestId?: string
    ) => Promise<void>;
    loading: boolean;
    initialData?: any;
}

const ContestFormModal: React.FC<ContestFormModalProps> = ({
    open,
    onClose,
    onSubmit,
    loading,
    initialData,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [scope, setScope] = useState('class');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [selectedCases, setSelectedCases] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState<string>(
        '09a7b352-1f11-ec11-90f0-d8d385fce79e'
    );

    const {
        classes,
        loading: classesLoading,
        courseOptions,
    } = useClasses(selectedCourseId);
    const { cases, loading: casesLoading } = useCases();

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setScope(initialData.scope || 'class');
            // Additional logic to populate fields for editing would go here
        } else {
            // Reset form for new entry
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

    const handleSelectionChange = (
        id: string,
        isSelected: boolean,
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        currentSelection: string[]
    ) => {
        if (isSelected) {
            setter([...currentSelection, id]);
        } else {
            setter(currentSelection.filter((currentId) => currentId !== id));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !name ||
            !scope ||
            !startTime ||
            !endTime ||
            selectedCases.length === 0
        ) {
            setError('Name, scope, times, and at least one case are required.');
            return;
        }
        if (scope === 'class' && selectedClasses.length === 0) {
            setError(
                'Please select at least one class for a class-scoped contest.'
            );
            return;
        }

        const formData = {
            name,
            description,
            scope,
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            case_ids: selectedCases,
            // Only include class_ids if the scope is 'class'
            ...(scope === 'class' && { class_ids: selectedClasses }),
        };

        await onSubmit(formData, !!initialData, initialData?.id);
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-base-100/50 flex items-center justify-center z-50"
            style={{ backdropFilter: 'blur(2px)' }}
        >
            <div
                className="bg-base-100 text-gray-800 rounded-lg border border-gray-600 shadow-lg w-full max-w-lg flex flex-col"
                style={{ maxHeight: '90vh' }}
            >
                <div className="p-6 border-b relative">

                    <h2 className="text-xl font-bold text-blue-700">
                        {initialData ? 'Edit Contest' : 'Add New Contest'}
                    </h2>
                    <button
                        className="absolute top-4 right-4 btn btn-sm btn-ghost text-xl text-red-300"
                        onClick={onClose}
                    >
                        <X/>
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 flex-grow overflow-y-auto flex flex-col gap-4"
                >
                    {error && (
                        <div className="alert alert-error text-sm">{error}</div>
                    )}

                    <input
                        className="input input-bordered placeholder:text-blue-100/50 text-gray-100"
                        placeholder="Contest Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <textarea
                        className="textarea textarea-bordered placeholder:text-blue-100/50 text-gray-100"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <select
                        className="select select-bordered text-blue-100/50"
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                    >
                        <option value="class">Class Contest</option>
                        <option value="global">Global Contest</option>
                    </select>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs mb-1">
                                Start Time
                            </label>
                            <input
                                className="input input-bordered w-full text-blue-100/50"
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">
                                End Time
                            </label>
                            <input
                                className="input input-bordered w-full text-gray-500"
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Conditional Class Selector */}
                    {scope === 'class' && (
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">
                                Filter by Course
                            </label>
                            <select
                                className="select select-bordered select-sm w-full mb-2 text-gray-500"
                                value={selectedCourseId}
                                onChange={(e) =>
                                    setSelectedCourseId(e.target.value)
                                }
                            >
                                {courseOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                            <ClassSelector
                                classes={classes}
                                loading={classesLoading}
                                selectedClasses={selectedClasses}
                                onChange={(id, selected) =>
                                    handleSelectionChange(
                                        id,
                                        selected,
                                        setSelectedClasses,
                                        selectedClasses
                                    )
                                }
                            />
                        </div>
                    )}

                    <CaseSelector
                        cases={cases}
                        loading={casesLoading}
                        selectedCases={selectedCases}
                        onChange={(id, selected) =>
                            handleSelectionChange(
                                id,
                                selected,
                                setSelectedCases,
                                selectedCases
                            )
                        }
                    />

                    <div className="pt-4 border-t mt-auto">
                        <button
                            className="btn btn-primary w-full bg-blue-500 hover:bg-blue-700 "
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? 'Saving...'
                                : initialData
                                ? 'Update Contest'
                                : 'Create Contest'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContestFormModal;
