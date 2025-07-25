import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContestDetails } from '../../hooks/useContestDetail';
import useClassDetails from '../../hooks/useClassDetail';
import { useClassContestSubmissions } from '../../hooks/useClassContestSubmissions';
import CodeViewer from '../../components/lecturer/CodeViewer';
import type { UserProfile } from '../../types/auth';
import type { SubmissionHistoryItem } from '../../types/submission';
import type { Case } from '../../types/case';


const LecturerSubmissionDetailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const classId = searchParams.get('classId') || undefined;
    const contestId = searchParams.get('contestId') || undefined;

    const { contest, cases } = useContestDetails(contestId);
    const { classData } = useClassDetails(classId);
    const { submissions, loading: submissionsLoading } =
        useClassContestSubmissions(classId, contestId);

    const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(
        null
    );
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [selectedSubmission, setSelectedSubmission] =
        useState<SubmissionHistoryItem | null>(null);

    // Filter submissions based on selected student and case
    const filteredSubmissions = useMemo(() => {
        return submissions
            .filter(
            (s) =>
                (!selectedStudent || s.user_id === selectedStudent.user_id) &&
                (!selectedCase || s.case_id === selectedCase.case_id)
            )
            .sort((a, b) => new Date(b.submit_time).getTime() - new Date(a.submit_time).getTime());
    }, [submissions, selectedStudent, selectedCase]);

    // Auto-select first student and case when data loads
    useEffect(() => {
        if (classData?.students?.length && !selectedStudent) {
            setSelectedStudent(classData.students[0]);
        }
    }, [classData, selectedStudent]);

    useEffect(() => {
        if (cases.length > 0 && !selectedCase) {
            setSelectedCase(cases[0]);
        }
    }, [cases]);

    // Auto-select first submission in the filtered list
    useEffect(() => {
        setSelectedSubmission(filteredSubmissions[0] || null);
    }, [filteredSubmissions]);

    return (
        <div className=" mx-auto p-6">
            <div className="bg-base-300 border border-gray-600 rounded-xl shadow p-6">
                <h2 className="text-3xl font-bold mb-4 text-blue-700">
                    {contest?.name || 'Submissions'}
                </h2>

                <div
                    className="flex flex-col lg:flex-row gap-6"
                    style={{ height: '75vh' }}
                >
                    {/* Student List Panel */}
                    <div className="lg:w-1/4 bg-base-100/50 p-4 rounded-lg border border-gray-600 flex flex-col">
                        <h3 className="font-bold text-blue-500 mb-2 flex-shrink-0">
                            Students
                        </h3>
                        <ul className="space-y-2 overflow-y-auto pr-2 flex-grow">
                            {classData?.students?.map((s) => (
                                <li key={s.user_id}>
                                    <button
                                        onClick={() => setSelectedStudent(s)}
                                        className={`w-full text-left p-2 rounded-md text-sm ${
                                            selectedStudent?.user_id ===
                                            s.user_id
                                                ? 'bg-blue-700 text-white'
                                                : 'bg-base-200 hover:bg-base-100'
                                        }`}
                                    >
                                        {s.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Content Panel */}
                    <div className="lg:w-3/4 flex flex-col gap-4">
                        <select
                            className="select select-bordered w-full h-[8vh] bg-base-100"
                            value={selectedCase?.case_id || ''}
                            onChange={(e) =>
                                setSelectedCase(
                                    cases.find(
                                        (c) => c.case_id === e.target.value
                                    ) || null
                                )
                            }
                        >
                            <option value="">All Cases</option>
                            {cases.map((c: Case) => (
                                <option key={c.case_id} value={c.case_id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex-grow flex flex-col md:flex-row gap-4 min-h-0">
                            <div className="md:w-2/5 bg-base-100/50 p-4 rounded-lg border border-gray-600 flex flex-col">
                                <h3 className="font-bold text-blue-500 mb-2 flex-shrink-0">
                                    Submissions
                                </h3>
                                <div className="overflow-y-auto flex-grow">
                                    <table className="table table-sm w-full">
                                        <tbody>
                                            {submissionsLoading ? (
                                                <tr>
                                                    <td>Loading...</td>
                                                </tr>
                                            ) : (
                                                filteredSubmissions.map(
                                                    (sub) => (
                                                        <tr
                                                            key={
                                                                sub.submission_id
                                                            }
                                                            onClick={() =>
                                                                setSelectedSubmission(
                                                                    sub
                                                                )
                                                            }
                                                            className={`cursor-pointer ${
                                                                selectedSubmission?.submission_id ===
                                                                sub.submission_id
                                                                    ? 'bg-blue-700 text-white'
                                                                    : 'hover:bg-base-200'
                                                            }`}
                                                        >
                                                            <td>
                                                                {sub.case_code}
                                                            </td>
                                                            <td
                                                                className={
                                                                    sub.status ===
                                                                    'Accepted'
                                                                        ? 'text-green-400'
                                                                        : 'text-red-400'
                                                                }
                                                            >
                                                                {sub.status}
                                                                <div className="text-xs text-gray-400">
                                                                    {new Date(sub.submit_time).toLocaleString()}
                                                                </div>
                                                            </td>
                                                            <td>{sub.score}</td>
                                                        </tr>
                                                    )
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="md:w-3/5 flex flex-col">
                                <CodeViewer submission={selectedSubmission} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturerSubmissionDetailPage;
