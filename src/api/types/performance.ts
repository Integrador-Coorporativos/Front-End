export interface ClassPerformanceResponse {
  classId: number; 
  courseName: string;
  gradleLevel: string;     
  shift: string;

  frequencyScore: number;
  unifirmScore: number;     //Ajustar no backend depois, uniformScore
  behaviorScore: number;
  participationScore: number;
  performanceScore: number;
  cellPhoneUseScore: number;

  averageScore: number;
}