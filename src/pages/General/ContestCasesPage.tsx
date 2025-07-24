import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSubmission } from '../../hooks/useSubmission';
import CaseDisplay from '../../components/contest/CaseDisplay';
import SubmissionWorkspace from '../../components/contest/SubmissionWorkspace';
import BackButton from '../../components/button/BackButton';
import { useContestDetails } from '../../hooks/useContestDetail';
import MyFullLeaderboardRow from '../../components/leaderboard/MyLeaderboardRow';
import type { Case } from '../../types/case';

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
    const submissionProps = useSubmission(contestId, cases);

    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    // console.log(cases)
    useEffect(() => {
        if (cases.length > 0 && !selectedCaseId) {
            setSelectedCaseId(cases[0].case_id);
        }
    }, [cases, selectedCaseId]);

    const selectedCase = useMemo(() => {
        // console.log(cases.find((c: Case) => c.case_id === selectedCaseId))
        return cases.find((c: Case) => c.case_id === selectedCaseId) || null;
    }, [cases, selectedCaseId]);

    if (loadingContest) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <>
            <main className="p-4 sm:p-6 lg:p-8 min-h-screen">
                <div className="max-w-screen-2xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-blue-700">
                            {contest?.name}
                        </h1>
                        <BackButton />
                    </div>

                    {contestId && (
                        <MyFullLeaderboardRow
                            contestId={contestId}
                            classId={classId}
                        />
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* Left Column: Case Selection and Display */}
                        <div className="space-y-4">
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
                                {/* Using 'id' for the key and value for consistency */}
                                {cases.map((c: Case) => (
                                    <option key={c.case_id} value={c.case_id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <CaseDisplay
                                selectedCase={selectedCase}
                                contestId={contestId}
                                classId={classId}
                            />
                        </div>

                        {/* Right Column: Submission Workspace */}
                        <SubmissionWorkspace
                            caseId={selectedCaseId}
                            contestId={contestId}
                            classId={classId}
                            {...submissionProps}
                        />
                    </div>
                </div>
            </main>
        </>
    );
};

export default ContestCasesPage;
