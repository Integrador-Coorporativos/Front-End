import styles from "./Dashboard.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import DashboardHeaderRow from "@/components/DashboardHeaderRow";
import AcademicPieCard from "@/components/AcademicPieCard";
import InfoCard from "@/components/InfoCard";
import StatTile from "@/components/StatTile";
import PerformancePanel from "@/components/PerformancePanel";

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.container}>
        <DashboardHeaderRow title="Dashboard Acadêmico" />

        <section className={styles.topGrid}>
          <AcademicPieCard />

          <InfoCard title="Resumo Geral" rightIcon="info">
            <div className={styles.tilesGrid}>
              <StatTile
                icon="alunos"
                label="Total de Alunos"
                value="120 Alunos"
              />

              <StatTile
                icon="aprovados"
                label="Aprovados"
                value="82%"
              />

              <StatTile
                icon="media"
                label="Média Geral"
                value="7.4"
              />

              <StatTile
                icon="reprovados"
                label="Reprovados"
                value="18%"
              />
            </div>
          </InfoCard>
        </section>

        <section className={styles.bottomPanel}>
          <PerformancePanel />
        </section>
      </main>

      <Footer />
    </div>
  );
}
