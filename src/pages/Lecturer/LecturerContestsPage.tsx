import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useClassContests from '../../hooks/useClassContests';
import { useContestDetails } from '../../hooks/useContestDetail';
import { createCasePdfFileUrl } from '../../utils/urlMaker';
import { useLecturerClasses } from '../../hooks/useLecturerClasses';

const LecturerContestsPage: React.FC = () => {
    const {
        classes,
        loading: classesLoading,
        error: classesError,
    } = useLecturerClasses();
    const [selectedClassId, setSelectedClassId] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        if (classes.length > 0 && !selectedClassId) {
            setSelectedClassId(classes[0].class_transaction_id);
        }
    }, [classes, selectedClassId]);

    return (
        <div className="container mx-auto p-6">
            <div className="bg-base-300 border border-gray-600 rounded-xl shadow p-6">
                <h2 className="text-3xl font-bold mb-4 text-blue-700">
                    My Assistant Contests
                </h2>

                {classesLoading ? (
                    <span className="loading loading-spinner"></span>
                ) : classesError ? (
                    <div className="alert alert-error">{classesError}</div>
                ) : (
                    <>
                        <label className="block text-xl mb-2 text-blue-500">
                            Select Class:
                        </label>
                        <select
                            className="select select-bordered w-full mb-6 text-white bg-base-100"
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                        >
                            {classes.map((cls) => (
                                <option
                                    key={cls.class_transaction_id}
                                    value={cls.class_transaction_id}
                                >
                                    {cls.class_code}
                                </option>
                            ))}
                        </select>
                        <ContestDetails selectedClassId={selectedClassId} />
                    </>
                )}
            </div>
        </div>
    );
};

const ContestDetails: React.FC<{ selectedClassId?: string }> = ({
    selectedClassId,
}) => {
    const {
        contests,
        loading: contestsLoading,
        error: contestsError,
    } = useClassContests(selectedClassId);
    const [selectedContestId, setSelectedContestId] = useState<
        string | undefined
    >(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        if (contests.length > 0) {
            setSelectedContestId(contests[0].contest_id);
        } else {
            setSelectedContestId(undefined);
        }
    }, [contests]);

    const {
        cases,
        loading: casesLoading,
        error: casesError,
    } = useContestDetails(selectedContestId);
    const selectedContest = contests.find(
        (c) => c.contest_id === selectedContestId
    );

    if (contestsLoading)
        return (
            <div className="text-center p-4">
                <span className="loading loading-spinner"></span>
            </div>
        );
    if (contestsError)
        return <div className="alert alert-error">{contestsError}</div>;
    if (contests.length === 0)
        return (
            <div className="text-center p-4 text-gray-400">
                No contests found for this class.
            </div>
        );

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Contest List */}
            <div className="lg:w-1/3">
                <div className="mb-2 text-blue-500 font-semibold text-2xl">
                    Contest List:
                </div>
                <ul className="space-y-2 max-h-[60vh] pr-2">
                    {contests.map((contest) => (
                        <li key={contest.contest_id}>
                            <button
                                onClick={() =>
                                    setSelectedContestId(contest.contest_id)
                                }
                                className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                                    selectedContestId === contest.contest_id
                                        ? 'bg-base-100 text-gray-100 border-gray-400 scale-105 shadow-lg'
                                        : 'bg-base-200/50 hover:bg-base-100/50 text-gray-300 hover:text-white border-gray-600'
                                }`}
                            >
                                <div className="font-semibold">
                                    {contest.contest?.name || 'No name'}
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Contest Details */}
            <div className="lg:w-2/3 bg-base-100/50 p-6 rounded-lg border border-gray-600">
                {selectedContest ? (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-blue-500">
                                {selectedContest.contest?.name}
                            </h3>
                            <p className="text-sm text-gray-300">
                                {selectedContest.contest?.description}
                            </p>
                        </div>
                        <div className="text-sm space-y-1">
                            <p>
                                <b>Start:</b>{' '}
                                {new Date(
                                    selectedContest.start_time
                                ).toLocaleString()}
                            </p>
                            <p>
                                <b>End:</b>{' '}
                                {new Date(
                                    selectedContest.end_time
                                ).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-500 mb-2">
                                Problems:
                            </h4>
                            {casesLoading ? (
                                <p>Loading problems...</p>
                            ) : casesError ? (
                                <p className="text-red-500">{casesError}</p>
                            ) : cases.length === 0 ? (
                                <p className="text-gray-400">No problems.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {cases.map((problem) => (
                                        <li key={problem.case_id}>
                                            <a
                                                href={createCasePdfFileUrl(
                                                    problem.pdf_file_url
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline btn-info btn-block justify-start"
                                            >
                                                {problem.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate(
                                        `/lecturer/submission-detail?classId=${selectedClassId}&contestId=${selectedContestId}`
                                    )
                                }
                            >
                                View Submissions
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        Select a contest
                    </div>
                )}
            </div>
        </div>
    );
};

export default LecturerContestsPage;
