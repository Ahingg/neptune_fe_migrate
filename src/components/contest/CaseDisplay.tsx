import React, { useState } from 'react';
import { createCasePdfFileUrl } from '../../utils/urlMaker';
import SubmissionHistory from './SubmissionHistory';
import type { Case } from '../../types/case';

interface CaseDisplayProps {
    selectedCase: Case | null;
    contestId?: string;
    classId?: string;
}

const CaseDisplay: React.FC<CaseDisplayProps> = ({
    selectedCase,
    contestId,
    classId,
}) => {
    const [activeTab, setActiveTab] = useState<'description' | 'history'>(
        'description'
    );

    if (!selectedCase) {
        return (
            <div className="flex items-center justify-center h-full bg-base-300 border border-gray-600 rounded-lg p-8">
                <p className="text-gray-500">
                    Select a case to view its details.
                </p>
            </div>
        );
    }
    return (
        <div className="bg-base-300 rounded-lg shadow-inner border border-gray-600 h-full">
            <div className="p-6 border-b border-gray-500/20">
                <h2 className="text-2xl font-bold text-blue-600">
                    {selectedCase.problem_code}. {selectedCase.name}
                </h2>
            </div>

            <div className="px-6 pt-4">
                <div role="tablist" className="tabs tabs-boxed bg-base-300">
                    <a
                        role="tab"
                        className={`tab ${
                            activeTab === 'description'
                                ? 'tab-active bg-base-100 text-blue-600'
                                : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('description')}
                    >
                        Problem
                    </a>
                    <a
                        role="tab"
                        className={`tab ${
                            activeTab === 'history'
                                ? 'tab-active bg-base-100 text-blue-600'
                                : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab('history')}
                    >
                        My Submissions
                    </a>
                </div>
            </div>

            <div className="p-6">
                {activeTab === 'description' && (
                    <div>
                        <p className="text-sm text-blue-700 mb-4 whitespace-pre-wrap">
                            {selectedCase.description}
                        </p>
                        <div className="flex flex-wrap gap-2 my-4">
                            <div className="badge badge-info">
                                Time: {selectedCase.time_limit_ms}ms
                            </div>
                            <div className="badge badge-info">
                                Memory: {selectedCase.memory_limit_mb}MB
                            </div>
                        </div>
                        {selectedCase.pdf_file_url && (
                            <a
                                href={createCasePdfFileUrl(
                                    selectedCase.pdf_file_url
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline btn-primary"
                            >
                                View Problem PDF
                            </a>
                        )}
                    </div>
                )}
                {activeTab === 'history' && (
                    <SubmissionHistory
                        contestId={contestId}
                        classId={classId}
                        caseId={selectedCase.case_id}
                    />
                )}
            </div>
        </div>
    );
};

export default CaseDisplay;
