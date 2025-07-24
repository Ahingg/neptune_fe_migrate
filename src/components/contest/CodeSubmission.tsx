import React, { useState, useEffect } from 'react';
import { useLanguages } from '../../hooks/useLanguage';

interface CodeSubmissionProps {
    caseId: string | null;
    contestId?: string;
    classId?: string;
    onSubmit: (formData: FormData) => void;
    isSubmitting: boolean;
}

const CodeSubmission: React.FC<CodeSubmissionProps> = ({
    caseId,
    contestId,
    classId,
    onSubmit,
    isSubmitting,
}) => {
    const { languages, loading: loadingLanguages } = useLanguages();
    const [activeTab, setActiveTab] = useState<'code' | 'file'>('file');
    const [code, setCode] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [languageId, setLanguageId] = useState<number>(0);

    useEffect(() => {
        if (languages.length > 0 && languageId === 0) {
            setLanguageId(languages[0].id);
        }
    }, [languages, languageId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!caseId || !languageId) return;

        const formData = new FormData();
        formData.append('case_id', caseId);
        formData.append('language_id', languageId.toString());
        if (contestId) formData.append('contest_id', contestId);
        if (classId) formData.append('class_transaction_id', classId);

        if (activeTab === 'code') {
            formData.append('source_code', code);
        } else if (selectedFile) {
            formData.append('source_file', selectedFile);
        }
        onSubmit(formData);
    };

    return (
        <div className="p-6 bg-base-300 rounded-lg shadow-inner border border-gray-800  h-4/5">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
                Submit Solution
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text mr-4">Language</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={languageId}
                        onChange={(e) => setLanguageId(Number(e.target.value))}
                        disabled={loadingLanguages}
                    >
                        {languages.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="tabs tabs-boxed mb-2">
                    <a
                        className={`tab ${
                            activeTab === 'file' ? 'tab-active' : ''
                        }`}
                        onClick={() => setActiveTab('file')}
                    >
                        File
                    </a>
                    <a
                        className={`tab ${
                            activeTab === 'code' ? 'tab-active' : ''
                        }`}
                        onClick={() => setActiveTab('code')}
                    >
                        Code
                    </a>
                </div>
                {activeTab === 'code' ? (
                    <textarea
                        className="textarea textarea-bordered w-full h-64 font-mono"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Paste your code here..."
                    ></textarea>
                ) : (
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full"
                        onChange={(e) =>
                            setSelectedFile(
                                e.target.files ? e.target.files[0] : null
                            )
                        }
                    />
                )}
                <div className="card-actions justify-end mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || !caseId}
                    >
                        {isSubmitting ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CodeSubmission;
