import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useContests } from '../../hooks/useContests';
import { useAdminPage } from '../../hooks/useAdminPage';
import AdminPageLayout from '../../components/admin/AdminPageLayout';
import * as contestApi from '../../api/contest';
import type { Contest } from '../../types/contest';
import ContestFormModal from '../../components/contest/ContestFormModal';

const ContestPage: React.FC = () => {
    const {
        contests,
        loading: contestsLoading,
        error: contestsError,
        deleteContest,
        fetchContests,
    } = useContests();
    const {
        loading: modalLoading,
        error: modalError,
        feedback,
        handleApiCall,
        setError,
    } = useAdminPage();

    const [showModal, setShowModal] = useState(false);
    const [editingContest, setEditingContest] = useState<Contest | null>(null);

    const handleAdd = () => {
        setEditingContest(null);
        setShowModal(true);
    };
    const handleEdit = (c: Contest) => {
        setEditingContest(c);
        setShowModal(true);
    };
    const handleModalClose = () => {
        setShowModal(false);
        setError(null);
    };

    const handleFormSubmit = async (
        formData: any,
        isEdit: boolean,
        contestId?: string
    ) => {
        const apiCall = async () => {
            let contest;
            if (isEdit && contestId) {
                contest = await contestApi.updateContest(contestId, formData);
            } else {
                contest = await contestApi.createContest(formData);
            }
            // Assign cases to contest for both global and class
            await contestApi.assignCasesToContest(
                contest.id,
                formData.case_ids
            );
            if (formData.scope === 'class') {
                await Promise.all(
                    formData.class_ids.map((classId: string) =>
                        contestApi.assignContestToClass(classId, {
                            contest_id: contest.id,
                            start_time: formData.start_time,
                            end_time: formData.end_time,
                        })
                    )
                );
            }
        };
        await handleApiCall(
            apiCall,
            `Contest ${isEdit ? 'updated' : 'created'} successfully.`
        );
        if (!modalError) {
            setShowModal(false);
            fetchContests(); // Refresh the list
        }
    };

    const handleDelete = async (id: string) => {
        if (
            window.confirm(
                'Are you sure? This will unassign it from all classes.'
            )
        ) {
            await handleApiCall(
                () => deleteContest(id),
                'Contest deleted successfully.'
            );
        }
    };

    return (
        <>
            <AdminPageLayout
                title="Contest Management"
                actions={
                    <button className="btn btn-primary" onClick={handleAdd}>
                        <Plus size={16} /> Add New Contest
                    </button>
                }
                loading={contestsLoading}
                error={contestsError || modalError}
                feedback={feedback}
            >
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-100">
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Scope</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contests.map((c) => (
                                <tr key={c.id} className="hover">
                                    <td className="font-bold">{c.name}</td>
                                    <td>{c.description}</td>
                                    <td>
                                        <span className="badge badge-ghost">
                                            {c.scope}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => handleEdit(c)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-ghost text-red-500"
                                            onClick={() => handleDelete(c.id)}
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

            <ContestFormModal
                open={showModal}
                onClose={handleModalClose}
                onSubmit={handleFormSubmit}
                loading={modalLoading}
                initialData={editingContest}
            />
        </>
    );
};

export default ContestPage;
