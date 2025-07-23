import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSubmission } from '../../hooks/useSubmission';
import CaseDisplay from '../../components/contest/CaseDisplay';
import SubmissionWorkspace from '../../components/contest/SubmissionWorkspace';
import { useContestDetails } from '../../hooks/useContestDetail';
import MyFullLeaderboardRow from '../../components/leaderboard/MyLeaderboardRow';
import BackButton from '../../components/button/BackButton';

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
    const submissionProps = useSubmission();

    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

    useEffect(() => {
        if (cases.length > 0 && !selectedCaseId) {
            setSelectedCaseId(cases[0].id);
        }
    }, [cases, selectedCaseId]);

    const selectedCase = useMemo(() => {
        return cases.find((c) => c.id === selectedCaseId) || null;
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
                    <BackButton/>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-blue-700">
                            {contest?.name}
                        </h1>
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
                                {cases.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <CaseDisplay selectedCase={selectedCase} />
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
