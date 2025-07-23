export interface Class {
  class_transaction_id: string;
  class_name: string;
  class_code: string;
  course_outline_id: string;
  semester_id: string;
  students?: UserProfile[];
  assistants?: UserProfile[];
}

export interface ClassContestAssignment {
  class_transaction_id: string;
  contest_id: string;
  start_time: string; // ISO 8601 string
  end_time: string; // ISO 8601 string
  created_at: string;
  contest?: Contest;
}
