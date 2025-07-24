import { CheckCircle } from 'lucide-react';
import React from 'react';
import type { SubmissionStatus } from '../../types/submission';


interface SubmissionResultDisplayProps {
    latestUpdate: WebSocketSubmissionUpdate | null;
    isJudging: boolean;
    judgingError: Event | null;
}

const getStatusColor = (status: SubmissionStatus | string): string => {
    switch (status) {
        case 'Accepted':
            return 'bg-green-100 text-green-700';
        case 'Wrong Answer':
        case 'Time Limit Exceeded':
        case 'Memory Limit Exceeded':
        case 'Runtime Error':
            return 'bg-red-700 text-red-100';
        case 'Compile Error':
            return 'bg-yellow-100 text-yellow-700';
        case 'Judging':
            return 'bg-blue-100 text-blue-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const VerdictRow: React.FC<{ result: TestCaseJudgingResult }> = ({
    result,
}) => (
    <tr>
        <td className="font-mono text-center">{result.number}</td>
        <td
            className={`font-semibold ${getStatusColor(result.verdict).replace(
                'bg-',
                'text-'
            )}`}
        >
            {result.verdict}
        </td>
        <td className='font-mono'>{result.input}</td>
        <td className="font-mono text-right">{result.time_ms} ms</td>
        <td className="font-mono text-right">{result.memory_kb} KB</td>
    </tr>
);

const SubmissionResultDisplay: React.FC<SubmissionResultDisplayProps> = ({
    latestUpdate,
    isJudging,
    judgingError,
}) => {
    console.log(isJudging)
    if (isJudging && !latestUpdate) {
        return (
            <div className="p-6 bg-base-300 rounded-lg shadow-inner border border-gray-800 text-center">
                <span className="loading loading-dots loading-md text-blue-500"></span>
                <p className="text-blue-600 font-semibold mt-2">
                    Judging your submission...
                </p>
            </div>
        );
    }

    if (!latestUpdate) return null;

    if (judgingError) {
        return (
            <div className="alert alert-error">
                WebSocket connection error. Please refresh.
            </div>
        );
    }

    // Special summary view for "Accepted"
    if (latestUpdate.status === 'Accepted') {
        const avgTime = (
            latestUpdate.testcases.reduce((acc, tc) => acc + tc.time_ms, 0) /
            latestUpdate.testcases.length
        ).toFixed(2);
        const maxMemory = Math.max(
            ...latestUpdate.testcases.map((tc) => tc.memory_kb)
        );
        return (
            <div className="p-6 bg-green-300 rounded-lg shadow-inner border border-green-200 text-green-800">
                
                <div className="flex items-center gap-4">
                    <span className="material-icons text-3xl">
                        <CheckCircle size={24}/>
                    </span>
                    <div>
                        <h3 className="font-bold text-xl">Accepted</h3>
                        <div className="flex gap-4 text-sm mt-1">
                            <span>
                                Avg. Time: <strong>{avgTime} ms</strong>
                            </span>
                            <span>
                                Max Memory: <strong>{maxMemory} KB</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Detailed view for other verdicts
    return (
        <div className="p-6 rounded-lg shadow-inner border border-gray-600">
            <div
                className={`p-3 rounded-lg bg-base-300 font-bold text-lg text-center mb-4 ${getStatusColor(
                    latestUpdate.status
                )}`}
            >
                Overall Status: {latestUpdate.status}
            </div>

            {latestUpdate.status === 'Compile Error' &&
                latestUpdate.testcases[0]?.stderr && (
                    <div className="mb-4">
                        <h3 className="font-semibold text-blue-700">
                            Compiler Message:
                        </h3>
                        <pre className="bg-gray-800 text-white p-3 rounded-md text-xs overflow-x-auto">
                            {latestUpdate.testcases[0].stderr}
                        </pre>
                    </div>
                )}

            <h3 className="font-semibold text-blue-600 mb-2">
                Testcase Results:
            </h3>
            <div className="overflow-x-auto max-h-60">
                <table className="table table-sm w-full">
                    <thead className="bg-base-300">
                        <tr>
                            <th className="text-center">#</th>
                            <th>Verdict</th>
                            <th>Input</th>
                            <th className="text-right">Time</th>
                            <th className="text-right">Memory</th>
                        </tr>
                    </thead>
                    <tbody>
                        {latestUpdate.testcases.map((tc) => (
                            <VerdictRow key={tc.number} result={tc} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubmissionResultDisplay;
