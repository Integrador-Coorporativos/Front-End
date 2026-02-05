export type ClassDetails = {
  id: number;
  name: string;
  semester: number;
  gradleLevel: number;
  shift: string;
  course: {
    id: number;
    name: string;
  };
};
