interface SubmitCodeRequest {
    case_id: string;
    language_id: number;
    source_code: string;
    contest_id?: string; // Optional
}

interface SubmitCodeResponse {
    submission_id: string;
    status: SubmissionStatus;
}

interface ErrorResponse {
    error: string;
}

interface SubmissionResult {
    submission_id: string; // foreign key
    number: number; // Testcase number
    verdict: string; // e.g., "Accepted", "Wrong Answer", "Time Limit Exceeded"
    time_ms: number;
    memory_kb: number;
    compile_output: string | null; // For compile errors (Judge0 only gives for first testcase)
    stdout: string | null; // Actual output
    stderr: string | null;
    input: string | null; // Input used for this testcase
    expected_output: string | null; // Expected output for this testcase
}

interface Submission {
    id: string; // uuid
    case_id: string; // uuid
    user_id: string; // uuid
    language_id: number;
    status: SubmissionStatus;
    source_code_path: string;
    score: number;
    contest_id: string | null; // uuid
    class_transaction_id: string | null; // uuid
    created_at: string; // time.Time
    updated_at: string; // time.Time
    submission_results?: SubmissionResult[]; // Optional, will be populated via WebSocket
}

type SubmissionStatus =
    | 'Judging'
    | 'Accepted'
    | 'Wrong Answer'
    | 'Time Limit Exceeded'
    | 'Memory Limit Exceeded'
    | 'Compile Error'
    | 'Runtime Error'
    | 'Internal Error';

export interface SubmissionHistoryItem {
    user_id: string | null; // User ID of the student
    username: string | null; // Username of the student
    name: string | null; // Full name of the student
    submission_id: string;
    contest_id: string;
    case_id: string;
    case_code: string;
    status: SubmissionStatus;
    score: number;
    submit_time: string; // ISO 8601 string
    language_id: number;
}
