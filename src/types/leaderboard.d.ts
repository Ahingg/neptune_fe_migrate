export interface CaseResult {
    submission_id: string;
    case_id: string;
    status: 'Accepted' | 'Wrong Answer' | 'No Submission' | string;
    score: number;
    is_solved: boolean;
    solve_time_minutes: number;
    wrong_attempts: number;
}

// Describes a single row in the leaderboard, representing one user's performance.
export interface LeaderboardRow {
    rank: number;
    user_id: string;
    username: string;
    name: string;
    solved_count: number;
    total_penalty: number;
    case_results: Record<string, CaseResult>; // A map where key is case_id
}

interface LeaderboardCaseData {
    case_id: string;
    case_code: string;
    case_name: string;
}

// Describes the full API response for the leaderboard.
export interface LeaderboardData {
    // An array of case IDs in the desired display order.
    class_transaction_id: string;
    contest_id: string;
    cases: LeaderboardCaseData[];
    leaderboard: LeaderboardRow[];
}
