export interface CreateEvaluationRequest {
  frequencyScore: number;
  unifirmScore: number;
  behaviorScore: number;
  participationScore: number;
  performanceScore: number;
  cellPhoneUseScore: number;
}

export interface EvaluationCriteriaResponse {
  id: number;
  frequencyScore: number;
  unifirmScore: number;
  behaviorScore: number;
  participationScore: number;
  performanceScore: number;
  cellPhoneUseScore: number;
  averageScore: number;
  active: boolean;
}

export interface CreateEvaluationResponse {
  id: number;
  classId: string;
  professorId: string;
  date: string;
  averageScore: number;
  criteria: EvaluationCriteriaResponse;
}