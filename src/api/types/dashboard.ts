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

  /** Média de frequência da turma */
  frequencyScore: number;

  /** Média de conformidade com o fardamento */
  unifirmScore: number; // Mantido com 'i' conforme seu Back-end

  /** Média de comportamento/atitude */
  behaviorScore: number;

  /** Média de participação nas aulas */
  participationScore: number;

  /** Média de desempenho acadêmico percebido */
  performanceScore: number;

  /** Média de uso adequado (ou restrição) de celular */
  cellPhoneUseScore: number;
}