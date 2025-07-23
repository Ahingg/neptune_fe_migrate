interface Contest {
    id: string;
    name: string;
    description: string;
}


interface ContestDetailAPIResponse {
    id: string;
    name: string;
    description: string;
    cases: ContestCase[];
}