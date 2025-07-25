


const COURSE_IDS = [
  {
    id: "09a7b352-1f11-ec11-90f0-d8d385fce79e",
    name: "Algorithm and Programming 1 (COMP6047001)",
  },
  {
    id: "c4abc69e-e63b-ee11-ae31-d8d385fce79e",
    name: "Algorithm and Programming 2 (COMP6878051)",
  },
];

export const useCourse = (courseId = COURSE_IDS[0].id) => {
  return {
    courseId,
    courseOptions: COURSE_IDS,
  };
};