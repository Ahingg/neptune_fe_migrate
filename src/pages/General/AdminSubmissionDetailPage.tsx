import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContestDetails } from '../../hooks/useContestDetail';
import useClassDetails from '../../hooks/useClassDetail';
import { useSubmissionHistory } from '../../hooks/useSubmissionHistory';
import useContestCases from '../../hooks/useContestCases';
import axios from 'axios';

const AdminSubmissionDetailPage: React.FC = () => {
    // Get classId and contestId from query params
    const [searchParams] = useSearchParams();
    const classId = searchParams.get('classId') || undefined;
    const contestId = searchParams.get('contestId') || undefined;

    // Fetch contest and cases
    const { contest, loading: contestLoading } = useContestDetails(contestId);
    // Fetch class and students
    const { classData, loading: classLoading } = useClassDetails(classId);
    // Fetch all submissions for this contest/class
    const { submissions, loading: submissionsLoading } = useSubmissionHistory(contestId, classId);

    // Use useContestCases to fetch cases for the contest
    const { cases, loading: casesLoading, error: casesError } = useContestCases(contestId);

    // State for selected student/case/submission
    const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);
    const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(undefined);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | undefined>(undefined);
    const [submissionCodes, setSubmissionCodes] = useState<{ [id: string]: string }>({});

    // Set defaults when data loads
    React.useEffect(() => {
        if (!selectedStudentId && classData?.students?.length) {
            setSelectedStudentId(classData.students[0].user_id);
        }
    }, [classData, selectedStudentId]);
    React.useEffect(() => {
        if (!selectedCaseId && cases?.length) {
            setSelectedCaseId(cases[0].case_id);
        }
    }, [cases, selectedCaseId]);

    // Filter submissions for selected student and case
    const filteredSubmissions = useMemo(() => {
        if (!selectedStudentId || !selectedCaseId) return [];
        return submissions.filter((s: any) => s.user_id === selectedStudentId && s.case_id === selectedCaseId);
    }, [submissions, selectedStudentId, selectedCaseId]);

    // Set default selected submission when filtered list changes
    React.useEffect(() => {
        if (filteredSubmissions.length && !selectedSubmissionId) {
            setSelectedSubmissionId(filteredSubmissions[0].submission_id);
        }
        if (!filteredSubmissions.length) {
            setSelectedSubmissionId(undefined);
        }
    }, [filteredSubmissions, selectedSubmissionId]);

    const selectedSubmission = filteredSubmissions.find((s: any) => s.submission_id === selectedSubmissionId);

    // Eagerly fetch all codes when submissions change
    useEffect(() => {
        if (submissions.length > 0) {
            Promise.all(
                submissions.map(sub =>
                    axios
                        .get(`/api/submissions/${sub.submission_id}/code`, {
                            withCredentials: true,
                            responseType: 'text',
                        })
                        .then(res => ({ id: sub.submission_id, code: res.data }))
                        .catch(() => ({ id: sub.submission_id, code: '// Failed to load code' }))
                )
            ).then(results => {
                const codeMap: { [id: string]: string } = {};
                results.forEach(({ id, code }) => {
                    codeMap[id] = code;
                });
                setSubmissionCodes(codeMap);
            });
        }
    }, [submissions]);

    return (
        <div className="container mx-auto p-6">
            <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl shadow-2xl p-8 border border-blue-100">
                {/* Top: Contest name and dropdowns */}
                <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
                    <div className="text-2xl font-bold text-blue-800 flex-1">
                        {contestLoading ? 'Loading...' : contest?.name || 'Contest'} (Admin View)
                    </div>
                    <div className="flex gap-4 flex-1 justify-end">
                        <select
                            className="select select-bordered bg-white border-blue-200 text-blue-800"
                            value={selectedCaseId || ''}
                            onChange={e => setSelectedCaseId(e.target.value)}
                            disabled={casesLoading}
                        >
                            {casesLoading ? (
                                <option>Loading...</option>
                            ) : casesError ? (
                                <option>Error loading cases</option>
                            ) : cases.map((c: any) => (
                                <option key={c.case_id} value={c.case_id}>{c.problem_code} - {c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex gap-6 h-[600px]">
                    {/* Sidebar: Student List */}
                    <div className="w-1/5 bg-white rounded-xl shadow p-4 overflow-y-auto flex flex-col">
                        <div className="font-bold text-blue-700 mb-2">Student List</div>
                        <ul className="space-y-1">
                            {classLoading ? (
                                <li>Loading...</li>
                            ) : classData?.students?.length ? (
                                classData.students.map((s: any) => (
                                    <li key={s.user_id}>
                                        <button
                                            className={`w-full text-left px-2 py-1 rounded transition-colors ${selectedStudentId === s.user_id ? 'bg-blue-200 text-blue-900 font-bold' : 'hover:bg-blue-100 text-blue-800'}`}
                                            onClick={() => setSelectedStudentId(s.user_id)}
                                        >
                                            {s.username} - {s.name}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li>No students found.</li>
                            )}
                        </ul>
                    </div>
                    {/* Main: Submission List + Detail + Code */}
                    <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-row gap-4">
                        {/* Submission List */}
                        <div className="w-1/4 flex flex-col border-r-2 border-blue-200 pr-4">
                            <div className="font-bold text-blue-700 mb-2">Submissions</div>
                            <ul className="space-y-1">
                                {submissionsLoading ? (
                                    <li>Loading...</li>
                                ) : filteredSubmissions.length ? (
                                    filteredSubmissions.map((sub: any, idx: number) => (
                                        <li key={sub.submission_id}>
                                            <button
                                                className={`w-full text-left px-2 py-1 rounded transition-colors ${selectedSubmissionId === sub.submission_id ? 'bg-blue-200 text-blue-900 font-bold' : 'hover:bg-blue-100 text-blue-800'}`}
                                                onClick={() => {
                                                    setSelectedSubmissionId(sub.submission_id);
                                                }}
                                            >
                                                {`Submission ${idx + 1} - ${sub.score}`}
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li>No submissions found.</li>
                                )}
                            </ul>
                        </div>
                        {/* Submission Detail + Code */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-bold text-blue-700">Score: {selectedSubmission?.score ?? '-'}</div>
                                <div className="font-bold text-blue-700">Submit time: {selectedSubmission?.submit_time ?? '-'}</div>
                            </div>
                            <div className="font-bold text-blue-700 mb-2">CODE</div>
                            <pre className="bg-blue-50 rounded-xl p-4 text-sm text-gray-800 overflow-x-auto flex-1">
                                {selectedSubmissionId ? submissionCodes[selectedSubmissionId] || '// No code' : '// No code'}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSubmissionDetailPage;
