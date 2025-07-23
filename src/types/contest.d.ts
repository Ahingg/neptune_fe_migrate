export interface Contest {
  id: string;
  name: string;
  description: string;
}

export interface ContestDetailAPIResponse {
  id: string;
  name: string;
  description: string;
  cases: ContestCase[];
}
