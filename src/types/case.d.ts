export interface Case {
  case_id: string;
  name: string;
  problem_code: string; // Unique code for the problem
  description: string;
  pdf_file_url: string; // URL to the problem statement PDF
  time_limit_ms: number;
  memory_limit_mb: number;
  created_at: string;
  updated_at: string;
}

export interface Testcase {
  case_id: string; // FK to Case ID (Go's snake_case becomes camelCase unless specified)
  number: number; // 1-based index
  input_url: string; // URL path to the input file
  output_url: string; // URL path to the expected output file
  created_at: string; // ISO 8601 string
}
