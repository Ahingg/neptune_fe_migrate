// MODEL DEFINITIONS

interface User {
  id: string;
  username: string;
  name: string;
  role: "Admin" | "Student" | "Assistant" | "Lecturer";
  enrollments?: UserEnrollmentDetail[];
}

interface UserEnrollmentDetail {
  class_transaction_id: string;
  class_name: string;
  course_outline_id: string;
  semester_id: string;
}

export interface UserProfile {
  user_id: string;
  name: string;
  username: string;
}

// API CALL
interface LoginRequest {
  username?: string;
  password?: string;
}

interface LoginResponse {
  user: User;
}

interface UserMeResponse {
  user: User;
}
