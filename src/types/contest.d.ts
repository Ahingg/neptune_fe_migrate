export interface Contest {
  id: string;
  name: string;
  scope: 'class' | 'global';
  description: string;
}

export interface ContestDetailAPIResponse {
  id: string;
  name: string;
  description: string;
  cases: Case[];
}

export interface GlobalContestResponse {
    id: string;
    name: string;
    description: string;
    scope: 'class' | 'global';
    start_time: string; // ISO 8601 string
    end_time: string; // ISO 8601 string
}

export interface GlobalContestDetailResponse extends GlobalContestResponse {
    cases: ContestCaseProblemResponse[]; // Assuming this type exists
}
