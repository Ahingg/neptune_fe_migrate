interface TestCaseJudgingResult {
    number: number;
    verdict: string; // e.g., "Passed", "Wrong Answer", "TLE", "RE", "CE"
    input: string; // Content of input.in
    expected_output: string; // Content of output.out
    actual_output: string; // Stdout from code execution
    stderr?: string; // Stderr from code execution (optional)
    time_ms: number; // Execution time in milliseconds
    memory_kb: number; // Memory usage in kilobytes
}

// Matches WebSocketSubmissionResult DTO from backend/services/service.go
interface WebSocketSubmissionUpdate {
    submission_id: string;
    score: number; // Overall score for the submission
    final_status: SubmissionStatus; // Overall verdict (e.g., "Accepted", "Wrong Answer")
    testcases: TestCaseJudgingResult[]; // Detailed results for each testcase
}
