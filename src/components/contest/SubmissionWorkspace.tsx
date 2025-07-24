import React, { useState, useEffect } from 'react';
import CodeSubmission from './CodeSubmission';
import SubmissionResultDisplay from './SubmissionResultDisplay';


interface SubmissionWorkspaceProps {
    caseId: string | null;
    contestId?: string;
    classId?: string;
    // Submission handling props
    submit: (formData: FormData) => void;
    isSubmitting: boolean;
    submissionError: string | null;
    // Result display props
    latestUpdate: WebSocketSubmissionUpdate | null;
    isJudging: boolean;
    judgingError: Event | null;
}

const SubmissionWorkspace: React.FC<SubmissionWorkspaceProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'submit' | 'result'>('submit');

    // Automatically switch to the result tab when judging starts
    useEffect(() => {
        if (props.isJudging || props.latestUpdate) {
            setActiveTab('result');
        }
    }, [props.isJudging, props.latestUpdate]);
    

    return (
        <div className="bg-base-300 rounded-lg shadow-inner border border-gray-600 h-full">
            <div className="px-6 pt-4">
                <div role="tablist" className="tabs tabs-boxed">
                    <a
                        role="tab"
                        className={`tab ${
                            activeTab === 'submit' ? 'tab-active' : ''
                        }`}
                        onClick={() => setActiveTab('submit')}
                    >
                        Submit
                    </a>
                    <a
                        role="tab"
                        className={`tab ${
                            activeTab === 'result' ? 'tab-active' : ''
                        }${!props.latestUpdate && !props.isJudging ? ' tab-disabled cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => {
                            if (props.latestUpdate || props.isJudging) {
                                setActiveTab('result');
                            }
                        }}
                        aria-disabled={!props.latestUpdate && !props.isJudging}
                        tabIndex={!props.latestUpdate && !props.isJudging ? -1 : 0}
                    >
                        Result
                    </a>
                </div>
            </div>

            <div className="p-6">
                {activeTab === 'submit' && (
                    <CodeSubmission
                        caseId={props.caseId}
                        contestId={props.contestId}
                        classId={props.classId}
                        onSubmit={props.submit}
                        isSubmitting={props.isSubmitting}
                    />
                )}
                {activeTab === 'result' && (
                    <SubmissionResultDisplay
                        latestUpdate={props.latestUpdate}
                        isJudging={props.isJudging}
                        judgingError={props.judgingError}
                    />
                )}
                {props.submissionError && activeTab === 'submit' && (
                    <div className="alert alert-error mt-4">
                        {props.submissionError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionWorkspace;
