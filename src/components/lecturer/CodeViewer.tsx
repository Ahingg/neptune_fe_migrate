import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

import type { SubmissionHistoryItem } from '../../types/submission';
import { downloadSubmissionCodeApi, getSubmissionCodeApi } from '../../api/submission';

// Make sure Prism is available on the window object
declare const window: any;

interface CodeViewerProps {
    submission: SubmissionHistoryItem | null;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ submission }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const language = 'cpp'; // Assuming C++ for now, can be made dynamic later

    useEffect(() => {
        if (submission) {
            setLoading(true);
            getSubmissionCodeApi(submission.submission_id)
                .then((fetchedCode) => setCode(fetchedCode))
                .catch(() => setCode('// Failed to load code'))
                .finally(() => setLoading(false));
        } else {
            setCode('');
        }
    }, [submission]);

    useEffect(() => {
        if (code && window.Prism) {
            window.Prism.highlightAll();
        }
    }, [code]);

    const handleDownload = () => {
        if (submission) {
            downloadSubmissionCodeApi(submission.submission_id);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-base-100/50 rounded-lg border border-gray-600">
                <span className="loading loading-spinner"></span>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="flex-1 flex items-center justify-center bg-base-100/50 rounded-lg border border-gray-600 text-gray-400">
                Select a submission to view code
            </div>
        );
    }

    return (
        <div className="bg-base-100 rounded-xl text-sm flex-1 h-full relative">
            <button
                onClick={handleDownload}
                className="btn btn-ghost btn-sm absolute top-2 right-2 z-10"
            >
                <Download size={16} />
            </button>
            <pre className="h-full">
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    );
};

export default CodeViewer;
