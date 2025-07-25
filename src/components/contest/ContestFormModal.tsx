import React, { useState, useEffect } from 'react';
import { useClasses } from '../../hooks/useClasses';
import useCases from '../../hooks/useCases';
import AdminModal from '../admin/AdminModal';
import ClassSelector from '../adminContest/ClassSelector';
import CaseSelector from '../adminContest/CaseSelector';
import { useCourse } from '../../hooks/useCourse';
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
    const [scope, setScope] = useState<'class' | 'global'>('class');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [selectedCases, setSelectedCases] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState<string>(
        '09a7b352-1f11-ec11-90f0-d8d385fce79e'
    );
    const {courseOptions} = useCourse()

    const {
        classes,
        loading: classesLoading,
    } = useClasses(selectedCourseId);
    const { cases, loading: casesLoading } = useCases();

    useEffect(() => {
        // Reset form state when modal opens or initial data changes
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setScope(initialData.scope || 'class');
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

    const handleSelectionChange = (
        id: string,
        isSelected: boolean,
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setter((prev) =>
            isSelected
                ? [...prev, id]
                : prev.filter((currentId) => currentId !== id)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
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
            ...(scope === 'class' && { class_ids: selectedClasses }),
        };
        await onSubmit(formData, !!initialData, initialData?.id);
    };

    return (
        <AdminModal
            open={open}
            onClose={onClose}
            title={initialData ? 'Edit Contest' : 'Add New Contest'}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                    <div className="alert alert-error text-sm">{error}</div>
                )}

                <input
                    className="input input-bordered bg-base-100"
                    placeholder="Contest Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    className="textarea textarea-bordered bg-base-100"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select
                    className="select select-bordered bg-base-100"
                    value={scope}
                    onChange={(e) =>
                        setScope(e.target.value as 'class' | 'global')
                    }
                >
                    <option value="class">Class Contest</option>
                    <option value="global">Global Contest</option>
                </select>

                <div className="flex gap-4">
                    <div className="flex-1 form-control">
                        <label className="label">
                            <span className="label-text">Start Time</span>
                        </label>
                        <input
                            className="input input-bordered w-full bg-base-100"
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 form-control">
                        <label className="label">
                            <span className="label-text">End Time</span>
                        </label>
                        <input
                            className="input input-bordered w-full bg-base-100"
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>

                {scope === 'class' && (
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-blue-500">
                                Filter by Course
                            </span>
                        </label>
                        <select
                            className="select select-bordered select-sm w-full mb-2 bg-base-100"
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
                                    setSelectedClasses
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
                        handleSelectionChange(id, selected, setSelectedCases)
                    }
                />

                <div className="pt-4 border-t border-gray-600 mt-2">
                    <button
                        className="btn btn-primary w-full"
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
        </AdminModal>
    );
};

export default ContestFormModal;
