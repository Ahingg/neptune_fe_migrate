import React, { useState } from 'react';
import { createCasePdfFileUrl } from '../../utils/urlMaker';

interface CaseDisplayProps {
    selectedCase: Case | null;
}

const CaseDisplay: React.FC<CaseDisplayProps> = ({ selectedCase }) => {
    const [activeTab, setActiveTab] = useState<'description' | 'history'>(
        'description'
    );

    if (!selectedCase) {
        return (
            <div className="flex items-center justify-center h-3/5 bg-base-300 border border-gray-600 rounded-lg p-8">
                <p className="text-gray-500">
                    Select a case to view its details.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-base-300 rounded-lg shadow-inner border border-gray-600 h-3/5">
            <div className="p-6 border-b border-gray-200">
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
                                ? 'tab-active border border-b-blue-500'
                                : ''
                        }`}
                        onClick={() => setActiveTab('description')}
                    >
                        Problem
                    </a>
                    <a
                        role="tab"
                        className={`tab text-blue-500 ${
                            activeTab === 'history'
                                ? 'tab-active border border-b-blue-500 '
                                : ''
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
                        <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">
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
                    <div className="text-center p-8 text-gray-500">
                        <p>
                            Your submission history for this case will be shown
                            here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseDisplay;
