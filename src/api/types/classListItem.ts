export type ClassListItem = {
  id: number;
  name: string;
  shift: string;
  totalStudents?: number;
  course: {
    id: number;
    name: string;
  } | null;
};
