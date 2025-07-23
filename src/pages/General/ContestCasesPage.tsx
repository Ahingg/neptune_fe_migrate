import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSubmission } from '../../hooks/useSubmission';
import CaseDisplay from '../../components/contest/CaseDisplay';
import CodeSubmission from '../../components/contest/CodeSubmission';
import { useContestDetails } from '../../hooks/useContestDetail';
import SubmissionResultDisplay from '../../components/contest/SubmissionResultDisplay';

const ContestCasesPage: React.FC = () => {
    const { contestId, classId } = useParams<{
        contestId: string;
        classId?: string;
    }>();
    const {
        contest,
        cases,
        loading: loadingContest,
    } = useContestDetails(contestId);
    const {
        submit,
        isSubmitting,
        submissionError,
        latestUpdate,
        isJudging,
        judgingError,
    } = useSubmission();

    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

    // Set the first case as selected by default once they load
    useState(() => {
        if (cases.length > 0 && !selectedCaseId) {
            setSelectedCaseId(cases[0].case_id);
        }
    });

    const selectedCase = useMemo(() => {
        return cases.find((c) => c.case_id === selectedCaseId) || null;
    }, [cases, selectedCaseId]);

    if (loadingContest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <>
            <main className="p-4 sm:p-6 lg:p-8 min-h-screen">
                <div className="max-w-screen-2xl mx-auto space-y-6">
                    <h1 className="text-3xl font-bold text-blue-700">
                        {contest?.name}
                    </h1>

                    {/* {contestId && <MyLeaderboardRow contestId={contestId} />} */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Case Details */}
                        <div className="space-y-4 h-screen">
                            <select
                                className="select select-bordered w-full"
                                value={selectedCaseId || ''}
                                onChange={(e) =>
                                    setSelectedCaseId(e.target.value)
                                }
                            >
                                <option disabled value="">
                                    Select a case
                                </option>
                                {cases.map((c) => (
                                    <option key={c.case_id} value={c.case_id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <CaseDisplay selectedCase={selectedCase} />
                        </div>

                        {/* Right Column: Submission and Results */}
                        <div className="space-y-4 h-screen">
                            <CodeSubmission
                                caseId={selectedCaseId}
                                contestId={contestId}
                                classId={classId}
                                onSubmit={submit}
                                isSubmitting={isSubmitting}
                            />
                            {submissionError && (
                                <div className="alert alert-error">
                                    {submissionError}
                                </div>
                            )}
                            {(isSubmitting || isJudging || latestUpdate) && (
                                <SubmissionResultDisplay
                                    latestUpdate={latestUpdate}
                                    isJudging={isJudging}
                                    judgingError={judgingError}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ContestCasesPage;
