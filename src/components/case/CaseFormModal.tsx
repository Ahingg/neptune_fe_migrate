import React, { useState, useEffect } from 'react';
import AdminModal from '../admin/AdminModal';
import type { Case } from '../../types/case';

interface CaseFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
    loading: boolean;
    initialData?: Case | null;
    error?: string | null;
}

const CaseFormModal: React.FC<CaseFormModalProps> = ({
    open,
    onClose,
    onSubmit,
    loading,
    initialData,
    error,
}) => {
    const [formData, setFormData] = useState<FormData>(new FormData());

    useEffect(() => {
        const newFormData = new FormData();
        if (initialData) {
            newFormData.append('name', initialData.name);
            newFormData.append('description', initialData.description);
            newFormData.append(
                'time_limit_ms',
                initialData.time_limit_ms.toString()
            );
            newFormData.append(
                'memory_limit_mb',
                initialData.memory_limit_mb.toString()
            );
        }
        setFormData(newFormData);
    }, [initialData, open]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        formData.set(name, value);
        const clonedFormData = new FormData();
        for (const [key, val] of formData.entries()) {
            clonedFormData.append(key, val);
        }
        // Only handle files if the target is an input of type 'file'
        if (
            e.target instanceof HTMLInputElement &&
            e.target.type === 'file' &&
            e.target.files?.[0]
        ) {
            formData.set('pdf_file', e.target.files[0]);
            const clonedFormDataWithFile = new FormData();
            for (const [key, val] of formData.entries()) {
                clonedFormDataWithFile.append(key, val);
            }
            setFormData(clonedFormDataWithFile);
        } else {
            setFormData(clonedFormData);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <AdminModal
            open={open}
            onClose={onClose}
            title={initialData ? 'Edit Case' : 'Add New Case'}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                    <div className="alert alert-error text-sm">{error}</div>
                )}

                <input
                    name="name"
                    className="input input-bordered bg-base-100"
                    placeholder="Name"
                    value={formData.get('name')?.toString() || ''}
                    onChange={handleChange}
                />
                <textarea
                    name="description"
                    className="textarea textarea-bordered bg-base-100"
                    placeholder="Description"
                    value={formData.get('description')?.toString() || ''}
                    onChange={handleChange}
                />
                <input
                    name="time_limit_ms"
                    className="input input-bordered bg-base-100"
                    type="number"
                    placeholder="Time Limit (ms)"
                    value={formData.get('time_limit_ms')?.toString() || ''}
                    onChange={handleChange}
                />
                <input
                    name="memory_limit_mb"
                    className="input input-bordered bg-base-100"
                    type="number"
                    placeholder="Memory Limit (MB)"
                    value={formData.get('memory_limit_mb')?.toString() || ''}
                    onChange={handleChange}
                />

                <label className="label">
                    <span className="label-text text-blue-500">
                        Problem PDF
                    </span>
                </label>
                <input
                    name="pdf_file"
                    className="file-input file-input-bordered w-full bg-base-100"
                    type="file"
                    accept="application/pdf"
                    onChange={handleChange}
                />

                <button
                    className="btn btn-primary mt-2"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Saving...'
                        : initialData
                        ? 'Update Case'
                        : 'Create Case'}
                </button>
            </form>
        </AdminModal>
    );
};

export default CaseFormModal;
