export interface StudentPerformance {
  id?: number;
  name?: string;          
  registration?: string;  
  studentId: string;      
  classId: string;       
  averageScore: number;
  attendenceRate: number;
  failedSubjects: number;
  ira: number;           
  totalLowGrades?: number;
  status: 'BOM' | 'RUIM' | 'OPTIMO';
}