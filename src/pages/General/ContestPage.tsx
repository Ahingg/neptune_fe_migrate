import React, { useState, useEffect } from 'react';
import { useContests } from '../../hooks/useContests';
import type { Contest } from '../../types/contest';
import ContestFormModal from '../../components/contest/ContestFormModal';
import * as contestApi from '../../api/contest';
import type { ClassContestAssignment } from '../../types/class';

function getStatus(start: Date, end: Date): string {
    const now = new Date();
    if (now < start) return 'Not Started';
    if (now > end) return 'Ended';
    return 'Ongoing';
}

function formatDate(date: Date) {
    return date.toLocaleString();
}

function formatDuration(start: Date, end: Date) {
    const ms = end.getTime() - start.getTime();
    if (ms <= 0) return '-';
    const mins = Math.floor(ms / 60000);
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return hours > 0 ? `${hours}h ${remMins}m` : `${remMins}m`;
}

// Helper to convert datetime-local to ISO string
function toISOStringWithTZ(local: string) {
    if (!local) return '';
    const date = new Date(local);
    return date.toISOString();
}

const ContestPage: React.FC = () => {
    const { contests, loading, error, deleteContest, fetchContests } = useContests();
    const [showModal, setShowModal] = useState(false);
    const [editContest, setEditContest] = useState<Contest | null>(null);
    const [feedback, setFeedback] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [assignmentsMap, setAssignmentsMap] = useState<Record<string, ClassContestAssignment[]>>({});
    const [assignmentsLoading, setAssignmentsLoading] = useState(false);

    // Fetch class assignments for each contest after contests are loaded
    useEffect(() => {
        const fetchAssignments = async () => {
            setAssignmentsLoading(true);
            const map: Record<string, ClassContestAssignment[]> = {};
            await Promise.all(
                contests.map(async (c) => {
                    try {
                        map[c.id] = await contestApi.getClassAssignmentsForContest(c.id);
                    } catch {
                        map[c.id] = [];
                    }
                })
            );
            setAssignmentsMap(map);
            setAssignmentsLoading(false);
        };
        if (contests.length > 0) fetchAssignments();
    }, [contests]);

    const handleAdd = () => {
        setEditContest(null);
        setShowModal(true);
    };
    const handleEdit = (c: Contest) => {
        setEditContest(c);
        setShowModal(true);
    };
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this contest?')) {
            await deleteContest(id);
            setFeedback('Contest deleted successfully.');
        }
    };
    const handleModalClose = () => {
        setShowModal(false);
        setEditContest(null);
        setFeedback('');
    };
    const handleModalSubmit = async (formData: any, isEdit: boolean, contestId?: string) => {
        setModalLoading(true);
        setFeedback('');
        let debugMsg = '';
        let lastPayload: any = null;
        try {
            if (isEdit && contestId) {
                debugMsg = 'Deleting previous contest...';
                await contestApi.deleteContest(contestId);
            }
            debugMsg = 'Creating contest...';
            // 1. Create contest
            const contest = await contestApi.createContest({
                name: formData.name,
                description: formData.description,
                scope: formData.scope,
            });
            debugMsg = 'Assigning cases to contest...';
            // 2. Assign cases
            await contestApi.assignCasesToContest(contest.id, formData.case_ids);
            debugMsg = 'Assigning contest to classes...';
            // 3. Assign to each class
            await Promise.all(
                formData.class_ids.map((classId: string) => {
                    lastPayload = {
                        contest_id: contest.id,
                        start_time: toISOStringWithTZ(formData.start_time),
                        end_time: toISOStringWithTZ(formData.end_time),
                    };
                    return contestApi.assignContestToClass(classId, lastPayload);
                })
            );
            setFeedback('Contest created and assigned successfully.');
            setShowModal(false);
            fetchContests();
        } catch (e: any) {
            let backendMsg = e?.response?.data?.error || '';
            let backendFull = e?.response ? JSON.stringify(e.response, null, 2) : '';
            setFeedback(
                (e.message || 'Failed to create contest.') +
                (debugMsg ? ` [Step: ${debugMsg}]` : '') +
                (lastPayload ? `\nPayload: ${JSON.stringify(lastPayload)}` : '') +
                (backendMsg ? `\nBackend: ${backendMsg}` : '') +
                (backendFull ? `\nBackend Response: ${backendFull}` : '') +
                `\nFull error: ${JSON.stringify(e, null, 2)}`
            );
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-2xl shadow-2xl p-8 border border-blue-100">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-blue-700 drop-shadow">Contests</h1>
                    <div className="flex gap-2">
                        <button className="btn bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 shadow border-none hover:bg-blue-700 transition-colors" onClick={handleAdd}>+ Add New Contest</button>
                    </div>
                </div>
                {feedback && <div className="mb-2 text-green-700 text-gray-800">{feedback}</div>}
                {(loading || assignmentsLoading) && <div className="text-gray-800">Loading...</div>}
                {error && <div className="text-red-700 text-gray-800">{error}</div>}
                <div className="overflow-x-auto">
                    <table className="table w-full text-blue-900">
                        <thead>
                            <tr className="bg-blue-50 text-blue-700">
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contests.map((c: any) => (
                                <tr key={c.id} className="hover:bg-blue-100 transition-colors">
                                    <td className="font-bold text-blue-800">{c.name}</td>
                                    <td>{c.description}</td>
                                    <td>
                                        <button className="btn btn-sm bg-blue-600 text-white font-semibold rounded-lg px-3 py-1 shadow border-none hover:bg-blue-700 transition-colors mr-2" onClick={() => handleEdit(c)}>Edit</button>
                                        <button className="btn btn-sm bg-red-600 text-white font-semibold rounded-lg px-3 py-1 shadow border-none hover:bg-red-700 transition-colors" onClick={() => handleDelete(c.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ContestFormModal
                open={showModal}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                loading={modalLoading}
                initialData={editContest}
            />
        </div>
    );
};

export default ContestPage;
