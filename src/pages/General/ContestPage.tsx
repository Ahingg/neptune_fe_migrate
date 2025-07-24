import React, { useState, useEffect } from 'react';
import { useContests } from '../../hooks/useContests';
import type { Contest } from '../../types/contest';
import ContestFormModal from '../../components/contest/ContestFormModal';
import * as contestApi from '../../api/contest';
import type { ClassContestAssignment } from '../../types/class';
import { useClasses } from '../../hooks/useClasses';
import useClassContests from '../../hooks/useClassContests';
import { useContestDetails } from '../../hooks/useContestDetail';
import { createCasePdfFileUrl } from '../../utils/urlMaker';
import type { Case } from '../../types/case';
import type { Class } from '../../types/class';
import { useNavigate } from 'react-router-dom';

// function getStatus(start: Date, end: Date): string {
//     const now = new Date();
//     if (now < start) return 'Not Started';
//     if (now > end) return 'Ended';
//     return 'Ongoing';
// }

// function formatDate(date: Date) {
//     return date.toLocaleString();
// }

// function formatDuration(start: Date, end: Date) {
//     const ms = end.getTime() - start.getTime();
//     if (ms <= 0) return '-';
//     const mins = Math.floor(ms / 60000);
//     const hours = Math.floor(mins / 60);
//     const remMins = mins % 60;
//     return hours > 0 ? `${hours}h ${remMins}m` : `${remMins}m`;
// }

// Helper to convert datetime-local to ISO string
function toISOStringWithTZ(local: string) {
    if (!local) return '';
    const date = new Date(local);
    return date.toISOString();
}

const ContestPage: React.FC = () => {
    // Admin contest management hooks
    const { contests, loading, error, deleteContest, fetchContests } = useContests();
    const [showModal, setShowModal] = useState(false);
    const [editContest, setEditContest] = useState<Contest | null>(null);
    const [feedback, setFeedback] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [assignmentsLoading, setAssignmentsLoading] = useState(false);

    // Admin class/contest/case view state
    const {
        classes,
        loading: classesLoading,
        error: classesError,
        courseOptions,
        courseId,
        setClasses,
        fetchClasses,
    } = useClasses();
    const [selectedCourseId, setSelectedCourseId] = useState<string>(courseId);
    const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);
    const [selectedContestId, setSelectedContestId] = useState<string | undefined>(undefined);

    // Update classes when course changes
    useEffect(() => {
        fetchClasses();
    }, [selectedCourseId]);

    // Set default class on load or when classes change
    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0].class_transaction_id);
        }
    }, [classes, selectedClassId]);

    // Fetch contests for selected class
    const { contests: classContests, loading: contestsLoading, error: contestsError } = useClassContests(selectedClassId);

    // Set default contest on load or when contests change
    useEffect(() => {
        if (classContests.length > 0 && !selectedContestId) {
            setSelectedContestId(classContests[0].contest_id);
        }
    }, [classContests, selectedContestId]);

    // Fetch cases for selected contest
    const { cases, loading: casesLoading, error: casesError } = useContestDetails(selectedContestId);

    const selectedContest: ClassContestAssignment | undefined = classContests.find(c => c.contest_id === selectedContestId);

    const navigate = useNavigate();

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
            {/* Admin contest management UI */}
            <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-2xl shadow-2xl p-8 border border-blue-100 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-blue-700 drop-shadow">Contests</h1>
                    <div className="flex gap-2">
                        <button className="btn bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 shadow border-none hover:bg-blue-700 transition-colors" onClick={handleAdd}>+ Add New Contest</button>
                    </div>
                </div>
                {feedback && <div className="mb-2 text-green-700">{feedback}</div>}
                {(loading || assignmentsLoading) && <div className="text-gray-800">Loading...</div>}
                {error && <div className="text-red-700">{error}</div>}
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
            {/* Admin class/contest/case view */}
            <div className="flex flex-col lg:flex-row gap-8 h-[800px]">
                {/* Left Box: Course & Class dropdown and contest list */}
                <div className="lg:w-1/2 w-full bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-2xl shadow-lg p-6 h-full flex flex-col border border-blue-100">
                    <h2 className="text-2xl font-extrabold text-blue-700 mb-4 drop-shadow">Class & Contest Browser</h2>
                    {/* Course Dropdown */}
                    <label className="block mb-2 text-blue-700 font-semibold">Select Course:</label>
                    <select
                        className="select select-bordered w-full mb-4 text-blue-800 bg-white border-blue-200"
                        value={selectedCourseId}
                        onChange={e => {
                            setSelectedCourseId(e.target.value);
                            setSelectedClassId(undefined); // reset class selection
                            setSelectedContestId(undefined); // reset contest selection
                        }}
                    >
                        {courseOptions.map((opt: { id: string; name: string }) => (
                            <option key={opt.id} value={opt.id} className="text-blue-800 bg-white">
                                {opt.name}
                            </option>
                        ))}
                    </select>
                    {/* Class Dropdown */}
                    {classesLoading ? (
                        <div className="text-gray-800">Loading classes...</div>
                    ) : classesError ? (
                        <div className="text-red-600 bg-red-50 p-3 rounded-lg">{classesError}</div>
                    ) : (
                        <>
                            <label className="block mb-2 text-blue-700 font-semibold">Select Class:</label>
                            <select
                                className="select select-bordered w-full mb-4 text-blue-800 bg-white border-blue-200"
                                value={selectedClassId}
                                onChange={e => {
                                    setSelectedClassId(e.target.value);
                                    setSelectedContestId(undefined); // reset contest selection
                                }}
                            >
                                {classes.map((cls: Class) => (
                                    <option key={cls.class_transaction_id} value={cls.class_transaction_id} className="text-blue-800 bg-white">
                                        {cls.class_code} - {cls.class_name || 'No name'}
                                    </option>
                                ))}
                            </select>
                            <div className="mb-2 text-blue-700 font-semibold">Contest List:</div>
                            <div className="flex-1 min-h-0 overflow-y-auto">
                                {contestsLoading ? (
                                    <div className="text-gray-800">Loading contests...</div>
                                ) : contestsError ? (
                                    <div className="text-red-600 bg-red-50 p-3 rounded-lg">{contestsError}</div>
                                ) : classContests.length === 0 ? (
                                    <div className="text-gray-400">No contests found for this class.</div>
                                ) : (
                                    <ul className="space-y-2">
                                        {classContests.map(contest => (
                                            <li key={contest.contest_id}>
                                                <button
                                                    onClick={() => setSelectedContestId(contest.contest_id)}
                                                    className={`w-full text-left p-3 rounded-lg transition-colors font-semibold border border-blue-200 shadow ${selectedContestId === contest.contest_id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white hover:bg-blue-100 text-blue-800'
                                                        }`}
                                                >
                                                    <div className="font-semibold">{contest.contest?.name || 'No name'}</div>
                                                    <div className="text-sm opacity-75">{contest.contest?.description || 'No description'}</div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {/* Right Box: Contest detail and case list */}
                <div className="lg:w-1/2 w-full bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col border border-blue-100">
                    <h2 className="text-2xl font-extrabold text-blue-700 mb-4 drop-shadow">Contest Details</h2>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        {selectedContest ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-700">{selectedContest.contest?.name || 'No name'}</h3>
                                    <div className="text-gray-800">{selectedContest.contest?.description || 'No description'}</div>
                                </div>
                                <div className="text-gray-800">
                                    <b>Start Time:</b> {selectedContest.start_time ? new Date(selectedContest.start_time).toLocaleString() : 'N/A'}
                                </div>
                                <div className="text-gray-800">
                                    <b>End Time:</b> {selectedContest.end_time ? new Date(selectedContest.end_time).toLocaleString() : 'N/A'}
                                </div>
                                <div className="text-blue-700 font-semibold mt-4">Problems:</div>
                                {casesLoading ? (
                                    <div className="text-gray-800">Loading problems...</div>
                                ) : casesError ? (
                                    <div className="text-red-600 bg-red-50 p-3 rounded-lg">{casesError}</div>
                                ) : cases.length === 0 ? (
                                    <div className="text-gray-400">No problems found for this contest.</div>
                                ) : (
                                    <ul className="space-y-2">
                                        {cases.map(problem => (
                                            <li key={problem.case_id}>
                                                <a
                                                    href={createCasePdfFileUrl(problem.pdf_file_url)}
                                                    download
                                                    className="block p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold border border-blue-200 shadow transition-colors"
                                                >
                                                    {problem.name || 'Untitled Problem'}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="mt-8 flex justify-end">
                                    <button
                                        className="px-6 py-2 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors shadow"
                                        onClick={() => {
                                            if (selectedClassId && selectedContestId) {
                                                navigate(`/general/admin-submission-detail?classId=${selectedClassId}&contestId=${selectedContestId}`);
                                            }
                                        }}
                                        disabled={!selectedClassId || !selectedContestId}
                                    >
                                        View Submission Details
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-400 text-center mt-8">Select a contest to view details</div>
                        )}
                    </div>
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
