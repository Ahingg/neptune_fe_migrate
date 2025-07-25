import React, { useState } from 'react';
import { Plus, UploadCloud } from 'lucide-react';
import useCases from '../../hooks/useCases';
import { useAdminPage } from '../../hooks/useAdminPage';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import CaseFormModal from '../../components/case/CaseFormModal';
import TestCaseUploadModal from '../../components/case/TestCaseUploadModal';
import { uploadTestCases } from '../../api/case';
import type { Case } from '../../types/case';

const CasePage: React.FC = () => {
    const {
        cases,
        loading: casesLoading,
        error: casesError,
        createCase,
        updateCase,
        deleteCase,
    } = useCases();
    const {
        loading: modalLoading,
        error: modalError,
        feedback,
        handleApiCall,
        setError,
    } = useAdminPage();

    const [showFormModal, setShowFormModal] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [editingCase, setEditingCase] = useState<Case | null>(null);

    const handleAdd = () => {
        setEditingCase(null);
        setShowFormModal(true);
    };
    const handleEdit = (c: Case) => {
        setEditingCase(c);
        setShowFormModal(true);
    };
    const handleModalClose = () => {
        setShowFormModal(false);
        setShowTestModal(false);
        setError(null);
    };

    const handleFormSubmit = async (formData: FormData) => {
        const isEdit = !!editingCase;
        let data: Record<string, any> = Object.fromEntries(formData.entries());

        // Convert time_limit_ms, memory_limit_kb, and memory_limit_mb to numbers if present
        if (data.time_limit_ms) data.time_limit_ms = Number(data.time_limit_ms);
        if (data.memory_limit_kb) data.memory_limit_kb = Number(data.memory_limit_kb);
        if (data.memory_limit_mb) data.memory_limit_mb = Number(data.memory_limit_mb);

        const apiCall = isEdit
            ? () => updateCase(editingCase!.case_id, data)
            : () => createCase(formData);
        await handleApiCall(
            apiCall,
            `Case ${isEdit ? 'updated' : 'created'} successfully.`
        );
        if (!modalError) setShowFormModal(false);
    };

    const handleTestSubmit = async (caseId: string, formData: FormData) => {
        await handleApiCall(
            () => uploadTestCases(caseId, formData),
            'Test cases uploaded successfully.'
        );
        if (!modalError) setShowTestModal(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure?')) {
            await handleApiCall(
                () => deleteCase(id),
                'Case deleted successfully.'
            );
        }
    };

    return (
        <>
            <AdminPageLayout
                title="Case Management"
                actions={
                    <>
                        <button className="btn btn-primary" onClick={handleAdd}>
                            <Plus size={16} /> Add New Case
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowTestModal(true)}
                        >
                            <UploadCloud size={16} /> Upload Test Cases
                        </button>
                    </>
                }
                loading={casesLoading}
                error={casesError || modalError}
                feedback={feedback}
            >
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-100">
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map((c) => (
                                <tr key={c.case_id} className="hover">
                                    <td className="font-bold">{c.name}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => handleEdit(c)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-ghost text-red-500"
                                            onClick={() => handleDelete(c.case_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminPageLayout>

            <CaseFormModal
                open={showFormModal}
                onClose={handleModalClose}
                onSubmit={handleFormSubmit}
                loading={modalLoading}
                initialData={editingCase}
                error={modalError}
            />
            <TestCaseUploadModal
                open={showTestModal}
                onClose={handleModalClose}
                onSubmit={handleTestSubmit}
                loading={modalLoading}
                caseList={cases}
                error={modalError}
            />
        </>
    );
};

export default CasePage;
