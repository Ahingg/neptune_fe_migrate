import React, { useState } from 'react';
import type { Case } from '../../types/case';

interface TestCaseUploadModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (caseId: string, formData: FormData) => Promise<void>;
    loading: boolean;
    caseList: Case[];
}

const TestCaseUploadModal: React.FC<TestCaseUploadModalProps> = ({ open, onClose, onSubmit, loading, caseList }) => {
    const [selectedCase, setSelectedCase] = useState('');
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCase || !zipFile) {
            setError('Please select a case and upload a zip file.');
            return;
        }
        if (zipFile.type !== 'application/zip' && !zipFile.name.endsWith('.zip')) {
            setError('Only zip files are allowed.');
            return;
        }
        const formData = new FormData();
        formData.append('test_case_zip', zipFile);
        await onSubmit(selectedCase, formData);
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(2px)' }}>
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
                <button className="absolute top-2 right-2 btn btn-sm" onClick={onClose}>&times;</button>
                <h2 className="text-xl font-bold mb-4">Upload Test Cases</h2>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <select className="select select-bordered" value={selectedCase} aria-label="Select Case" onChange={e => setSelectedCase(e.target.value)}>
                        <option value="">Select Case</option>
                        {caseList.map(c => (
                            <option key={c.case_id} value={c.case_id}>{c.name}</option>
                        ))}
                    </select>
                    <span className="text-xs text-gray-500 ml-1">Choose the case to which you want to assign these test cases.</span>
                    <input className="file-input file-input-bordered" type="file" accept=".zip,application/zip" aria-label="Test case zip file" onChange={e => setZipFile(e.target.files?.[0] || null)} />
                    <span className="text-xs text-gray-500 ml-1">Upload a zip file containing all test cases for the selected case.</span>
                    <button className="btn btn-primary mt-2" type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
                </form>
            </div>
        </div>
    );
};

export default TestCaseUploadModal;
