import React, { useState, useEffect } from 'react';
import type { Case } from '../../types/case';

interface CaseFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData, isEdit: boolean, caseId?: string) => Promise<void>;
    loading: boolean;
    initialData?: Case | null;
}

const CaseFormModal: React.FC<CaseFormModalProps> = ({ open, onClose, onSubmit, loading, initialData }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [timeLimit, setTimeLimit] = useState('');
    const [memoryLimit, setMemoryLimit] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setTimeLimit(initialData.time_limit_ms.toString());
            setMemoryLimit(initialData.memory_limit_mb.toString());
            setPdfFile(null);
        } else {
            setName('');
            setDescription('');
            setTimeLimit('');
            setMemoryLimit('');
            setPdfFile(null);
        }
        setError('');
    }, [initialData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !timeLimit || !memoryLimit || (!initialData && !pdfFile)) {
            setError('All fields are required. PDF is required for new case.');
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('time_limit_ms', timeLimit);
        formData.append('memory_limit_mb', memoryLimit);
        if (pdfFile) formData.append('pdf_file', pdfFile);
        await onSubmit(formData, !!initialData, initialData?.case_id);
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[10px]">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border-2 border-blue-200 relative">
                <button className="absolute top-3 right-3 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl shadow transition-colors" onClick={onClose}>&times;</button>
                <h2 className="text-2xl font-extrabold text-blue-700 mb-4 drop-shadow">{initialData ? 'Edit Case' : 'Add New Case'}</h2>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input className="input input-bordered border-blue-200 focus:border-blue-400" placeholder="Name" aria-label="Case Name" value={name} onChange={e => setName(e.target.value)} />
                    <span className="text-xs text-blue-600 ml-1">Enter a descriptive name for the case/problem.</span>
                    <textarea className="textarea textarea-bordered border-blue-200 focus:border-blue-400" placeholder="Description" aria-label="Case Description" value={description} onChange={e => setDescription(e.target.value)} />
                    <span className="text-xs text-blue-600 ml-1">Provide a detailed description or statement for the case.</span>
                    <input className="input input-bordered border-blue-200 focus:border-blue-400" type="number" placeholder="Time Limit (ms)" aria-label="Time Limit in milliseconds" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} />
                    <span className="text-xs text-blue-600 ml-1">Maximum time allowed for submissions (in milliseconds).</span>
                    <input className="input input-bordered border-blue-200 focus:border-blue-400" type="number" placeholder="Memory Limit (MB)" aria-label="Memory Limit in megabytes" value={memoryLimit} onChange={e => setMemoryLimit(e.target.value)} />
                    <span className="text-xs text-blue-600 ml-1">Maximum memory allowed for submissions (in megabytes).</span>
                    {!initialData && (
                        <>
                            <input className="file-input file-input-bordered border-blue-200 focus:border-blue-400" type="file" accept="application/pdf" aria-label="PDF file for case statement" onChange={e => setPdfFile(e.target.files?.[0] || null)} />
                            <span className="text-xs text-blue-600 ml-1">Upload a PDF file containing the problem statement.</span>
                        </>
                    )}
                    <button className="btn bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 shadow border-none hover:bg-blue-700 transition-colors mt-2" type="submit" disabled={loading}>{loading ? 'Saving...' : (initialData ? 'Update Case' : 'Create Case')}</button>
                </form>
            </div>
        </div>
    );
};

export default CaseFormModal;
