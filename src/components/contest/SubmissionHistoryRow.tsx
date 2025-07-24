import React from 'react';
import { useAtomValue } from 'jotai';
import { languagesAtom } from '../../store/language'; // Assuming atom is in src/store/language.ts
import type { SubmissionHistoryItem } from '../../types/submission';


interface SubmissionHistoryRowProps {
    submission: SubmissionHistoryItem;
}

const getStatusClass = (status: string) => {
    if (status === 'Accepted') return 'text-green-500 font-bold';
    if (status.includes('Error') || status.includes('Wrong'))
        return 'text-red-500';
    return 'text-gray-600';
};

const SubmissionHistoryRow: React.FC<SubmissionHistoryRowProps> = ({
    submission,
}) => {
    const allLanguages = useAtomValue(languagesAtom);
    const languageName =
        allLanguages.find((lang) => lang.id === submission.language_id)?.name ||
        'Unknown';

    return (
        <tr className="hover:bg-blue-50/50">
            <td>{submission.case_code}</td>
            <td className={getStatusClass(submission.status)}>
                {submission.status}
            </td>
            <td className="font-bold text-center">{submission.score}</td>
            <td>{languageName}</td>
            <td className="text-sm text-gray-500">
                {new Date(submission.submit_time).toLocaleString()}
            </td>
        </tr>
    );
};

export default SubmissionHistoryRow;
