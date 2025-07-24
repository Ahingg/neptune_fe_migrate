import React from 'react';
import type { Case } from '../../types/case';

interface CaseSelectorProps {
    cases: Case[];
    loading: boolean;
    selectedCases: string[];
    onChange: (caseId: string, isSelected: boolean) => void;
}

const CaseSelector: React.FC<CaseSelectorProps> = ({
    cases,
    loading,
    selectedCases,
    onChange,
}) => {
    if (loading) return <div>Loading cases...</div>;

    return (
        <div>
            <label className="block text-xs text-gray-500 mb-1">
                Assign Cases{' '}
                <span className="text-gray-400">
                    ({selectedCases.length} selected)
                </span>
            </label>
            <div className="max-h-32 overflow-y-auto border rounded p-2 bg-base-100">
                {cases.length === 0 ? (
                    <div className="text-gray-400">No cases available.</div>
                ) : (
                    cases.map((cs: Case) => (
                        <label
                            key={cs.case_id}
                            className="flex items-center gap-2 cursor-pointer py-1 text-gray-100"
                        >
                            <input
                                type="checkbox"
                                className="checkbox checkbox-sm"
                                checked={selectedCases.includes(cs.case_id)}
                                onChange={(e) =>
                                    onChange(cs.case_id, e.target.checked)
                                }
                            />
                            <span>{cs.name}</span>
                        </label>
                    ))
                )}
            </div>
        </div>
    );
};

export default CaseSelector;
