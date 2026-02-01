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

export interface ClassPerformanceRank {
  frequencyRank: number;
  unifirmRank: number;
  behaviorRank: number;
  participationRank: number;
  performanceRank: number;
  cellPhoneUseRank: number;
  averageRank: number;
  classid: number;
}

export interface ClassPerformanceByYearResponse {
  classId: number;
  courseName: string;
  gradleLevel: string;
  shift: string;

  frequencyScore: number;
  unifirmScore: number;
  behaviorScore: number;
  participationScore: number;
  performanceScore: number;
  cellPhoneUseScore: number;
  averageScore: number;

  rank: ClassPerformanceRank;
}