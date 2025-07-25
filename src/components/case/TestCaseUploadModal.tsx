import React, { useState } from 'react';
import AdminModal from '../admin/AdminModal';
import type { Case } from '../../types/case';

interface TestCaseUploadModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (caseId: string, formData: FormData) => Promise<void>;
    loading: boolean;
    caseList: Case[];
    error?: string | null;
}

const TestCaseUploadModal: React.FC<TestCaseUploadModalProps> = ({
    open,
    onClose,
    onSubmit,
    loading,
    caseList,
    error,
}) => {
    const [selectedCase, setSelectedCase] = useState('');
    const [zipFile, setZipFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCase || !zipFile) return;
        const formData = new FormData();
        formData.append('test_case_zip', zipFile);
        onSubmit(selectedCase, formData);
    };

    return (
        <AdminModal open={open} onClose={onClose} title="Upload Test Cases">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                    <div className="alert alert-error text-sm">{error}</div>
                )}
                <select
                    className="select select-bordered bg-base-100"
                    value={selectedCase}
                    onChange={(e) => setSelectedCase(e.target.value)}
                >
                    <option value="">Select Case</option>
                    {caseList.map((c) => (
                        <option key={c.case_id} value={c.case_id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <input
                    className="file-input file-input-bordered w-full bg-base-100"
                    type="file"
                    accept=".zip,application/zip"
                    onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                />
                <button
                    className="btn btn-primary mt-2"
                    type="submit"
                    disabled={loading || !selectedCase || !zipFile}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </AdminModal>
    );
};

export default TestCaseUploadModal;
