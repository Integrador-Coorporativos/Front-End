import { type Course } from './course';

export interface Classes {
  id: number;
  name: string;
  shift: string;
  course: {
    id: number;
    name: string;
  };
}

export interface StudentPerformance {
  id: number;
  name: string;
  registration: string;
  studentId: string;
  classId: string;
  averageScore: number;
  attendenceRate: number;
  failedSubjects: number;
  ira: number;
  status: "Ótimo" | "Bom" | "Ruim";
  lastUpdate: string | null;
}

export interface ClassResponse {
  id: number;
  classId: string;
  name: string;
  semester: string;
  shift: string;
  gradleLevel: string;
  teacherLinked: boolean;
  course: Course;
  students: StudentPerformance[];
  comments: any[];
}

export interface ClassListItem {
  id: number;
  name: string;
  semester: string;
  shift: string;
  gradleLevel: number;
  teacherLinked: boolean;
  course: {
    id: number;
    name: string;
  };
}
