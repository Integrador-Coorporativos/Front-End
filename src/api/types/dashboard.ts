export interface DashboardMetrics {
  /** Nome do período letivo (ex: 2026-QUARTO) */
  periodName: string | null;
  
  /** Quantidade total de alunos vinculados ao professor */
  totalStudents: number;
  
  /** Média geral (IRA/Média das Médias) consolidada */
  generalAverage: number;
  
  /** Taxa de aprovação (Soma de Verde + Amarelo) em % */
  approvalRate: number;
  
  /** Taxa de reprovação/alerta (Vermelho) em % */
  failureRate: number;
  
  /** Percentual de alunos em situação ÓTIMA (Verde) */
  studentsGoodStatusPercentage: number;
  
  /** Percentual de alunos em situação de ATENÇÃO (Amarelo) */
  studentsAlertStatusPercentage: number;
  
  /** Percentual de alunos em situação CRÍTICA (Vermelho) */
  studentsCriticalStatusPercentage: number;
}