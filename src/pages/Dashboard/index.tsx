import styles from "./Dashboard.module.css";
import { LoadingState, ErrorState } from "@/components/FeedbackStates/FeedbackStates";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DashboardHeaderRow from "@/components/DashboardHeaderRow";
import AcademicPieCard from "@/components/AcademicPieCard";
import InfoCard from "@/components/InfoCard";
import StatTile from "@/components/StatTile";
import PerformancePanel from "@/components/PerformancePanel";

import { useDashboard } from "@/hooks/useDashboardStats";

export default function Dashboard() {
  const { metrics, loading, error } = useDashboard();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.container}>
        {loading ? ( //inicio 
          <LoadingState message="Carregando indicadores..." />
        ) : error ? (
          <ErrorState 
            message={error || "Erro ao carregar dados do dashboard."} 
            onRetry={() => window.location.reload()} 
          />
        ) : (//fim
          <>
            <DashboardHeaderRow 
              title={`Dashboard Acadêmico - ${metrics?.periodName || "Geral"}`} 
            />

            <section className={styles.topGrid}>
              <AcademicPieCard 
                greenValue={metrics?.studentsGoodStatusPercentage || 0} 
                yellowValue={metrics?.studentsAlertStatusPercentage || 0} 
                redValue={metrics?.studentsCriticalStatusPercentage || 0} 
              />

              <InfoCard title="Resumo Geral" rightIcon="info">
                <div className={styles.tilesGrid}>
                  <StatTile
                    icon="alunos"
                    label="Total de Alunos"
                    value={`${metrics?.totalStudents || 0} Alunos`}
                  />

                  <StatTile
                    icon="aprovados"
                    label="Aprovados"
                    value={`${metrics?.approvalRate?.toFixed(1) || 0}%`}
                  />

                  <StatTile
                    icon="media"
                    label="Média Geral"
                    value={`${metrics?.generalAverage?.toFixed(1) || 0}`}
                  />

                  <StatTile
                    icon="reprovados"
                    label="Reprovados"
                    value={`${metrics?.failureRate?.toFixed(1) || 0}%`}
                  />
                </div>
              </InfoCard>
            </section>

            <section className={styles.bottomPanel}>
              <PerformancePanel />
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}