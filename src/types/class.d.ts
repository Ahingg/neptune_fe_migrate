import type { UserProfile } from "./auth";

interface ClassAssistant {
  ClassTransactionID: string;
  UserID: string;
  User: {
    ID: string;
    Username: string;
    Name: string;
    Role: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
}

interface Class {
  class_transaction_id: string;
  semester_id: string;
  course_outline_id: string;
  class_code: string;
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
