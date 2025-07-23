import React, { useState } from 'react';
import { useCases } from '../../hooks/useCases';
import type { Case } from '../../types/case';
import CaseFormModal from '../../components/case/CaseFormModal';
import TestCaseUploadModal from '../../components/case/TestCaseUploadModal';
import { uploadTestCases } from '../../api/case';

const CasePage: React.FC = () => {
    const { cases, loading, error, createCase, updateCase, deleteCase, fetchCases } = useCases();
    const [showModal, setShowModal] = useState(false);
    const [editCase, setEditCase] = useState<Case | null>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [testLoading, setTestLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleAdd = () => {
        setEditCase(null);
        setShowModal(true);
    };
    const handleEdit = (c: Case) => {
        setEditCase(c);
        setShowModal(true);
    };
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this case?')) {
            await deleteCase(id);
            setFeedback('Case deleted successfully.');
        }
    };
    const handleModalClose = () => {
        setShowModal(false);
        setEditCase(null);
        setFeedback('');
    };
    const handleModalSubmit = async (formData: FormData, isEdit: boolean, caseId?: string) => {
        setModalLoading(true);
        try {
            if (isEdit && caseId) {
                await updateCase(caseId, Object.fromEntries(formData.entries()));
                setFeedback('Case updated successfully.');
            } else {
                await createCase(formData);
                setFeedback('Case created successfully.');
            }
            setShowModal(false);
        } catch (e) {
            setFeedback('Error saving case.');
        } finally {
            setModalLoading(false);
        }
    };
    const handleTestModalClose = () => {
        setShowTestModal(false);
        setFeedback('');
    };
    const handleTestModalSubmit = async (caseId: string, formData: FormData) => {
        setTestLoading(true);
        try {
            await uploadTestCases(caseId, formData);
            setFeedback('Test cases uploaded successfully.');
            setShowTestModal(false);
        } catch (e) {
            setFeedback('Error uploading test cases.');
        } finally {
            setTestLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Cases</h1>
                <div className="flex gap-2">
                    <button className="btn btn-outline" onClick={handleAdd}>+ Add New Case</button>
                    <button className="btn btn-outline" onClick={() => setShowTestModal(true)}>Upload Test Cases</button>
                </div>
            </div>
            {feedback && <div className="mb-2 text-green-600">{feedback}</div>}
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Problem Code</th>
                            <th>Time Limit (ms)</th>
                            <th>Memory Limit (MB)</th>
                            <th>PDF</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map((c) => (
                            <tr key={c.case_id}>
                                <td>{c.name}</td>
                                <td>{c.problem_code}</td>
                                <td>{c.time_limit_ms}</td>
                                <td>{c.memory_limit_mb}</td>
                                <td>
                                    <a href={c.pdf_file_url} target="_blank" rel="noopener noreferrer" className="link link-primary">PDF</a>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-info mr-2" onClick={() => handleEdit(c)}>Edit</button>
                                    {/* <button className="btn btn-sm btn-neutral" onClick={() => handleEdit(c)}>Edit</button> */}
                                    <button className="btn btn-sm btn-outline" onClick={() => handleDelete(c.case_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CaseFormModal
                open={showModal}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                loading={modalLoading}
                initialData={editCase}
            />
            <TestCaseUploadModal
                open={showTestModal}
                onClose={handleTestModalClose}
                onSubmit={handleTestModalSubmit}
                loading={testLoading}
                caseList={cases}
            />
        </div>
    );
};

export default CasePage;
