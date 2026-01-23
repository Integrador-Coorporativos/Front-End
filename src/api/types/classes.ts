import { type Course } from './course';
export interface StudentPerformance {
  id: number;
  name: string;
  registration: string;
  studentId: string; // O UUID que vem do Keycloak
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
  classId: string; // ID textual da turma (ex: 20231.1.09404.1V)
  name: string;
  semester: string;
  shift: string;
  gradleLevel: number;
  course: Course;
  students: StudentPerformance[];
  comments: any[]; 
}