import Header from "../../components/Header"
import BreadCrumb from "../../components/BreadCrumb"
import styles from "./RankingDetail.module.css"
import { useState } from "react"

import Phone from "../../assets/logo-phone.png"
import Participation from "../../assets/participation-icon.png"
import Performance from "../../assets/perfomance-icon.png"
import Frequency from "../../assets/frequency-icon.png"
import Uniform from "../../assets/uniform-icon.png"
import Behavior from "../../assets/behavior-icon.png"
import Footer from "../../components/Footer"

import RadarPerformanceChart from "../../components/RadarPerformanceChart"

type Avaliacao = {
  frequencia: number
  participacao: number
  fardamento: number
  desempenho: number
  comportamento: number
  usoCelular: number
}

type RatingProps = {
  label: string
  campo: keyof Avaliacao
}

type ChartData = {
  label: string
  value: number
}

function calcularMediaGeral(
  dataByYear: Record<string, ChartData[]>
): ChartData[] {
  const acumulado: Record<
    string,
    { total: number; count: number }
  > = {}

  Object.values(dataByYear).forEach((yearData) => {
    yearData.forEach(({ label, value }) => {
      if (!acumulado[label]) {
        acumulado[label] = { total: 0, count: 0 }
      }
      acumulado[label].total += value
      acumulado[label].count += 1
    })
  })

  return Object.entries(acumulado).map(
    ([label, { total, count }]) => ({
      label,
      value: Number((total / count).toFixed(1)),
    })
  )
}

export default function Classifications() {
  const cards = [
    { title: "Uso do Celular", icon: Phone },
    { title: "Participação", icon: Participation },
    { title: "Desempenho", icon: Performance },
    { title: "Frequência", icon: Frequency },
    { title: "Fardamento", icon: Uniform },
    { title: "Comportamento", icon: Behavior },
  ]

  const [activeTab, setActiveTab] = useState<
    "avaliar" | "grafico"
  >("grafico")

  const [selectedYear, setSelectedYear] = useState("Geral")

  const years = ["Geral", "2022", "2023", "2024", "2025"]

  const chartDataByYear: Record<string, ChartData[]> = {
    "2022": [
      { label: "Frequência", value: 4.1 },
      { label: "Participação", value: 3.9 },
      { label: "Desempenho", value: 4.0 },
      { label: "Comportamento", value: 4.2 },
      { label: "Fardamento", value: 3.8 },
      { label: "Uso do Celular", value: 3.6 },
    ],
    "2023": [
      { label: "Frequência", value: 4.3 },
      { label: "Participação", value: 4.0 },
      { label: "Desempenho", value: 4.4 },
      { label: "Comportamento", value: 4.6 },
      { label: "Fardamento", value: 4.0 },
      { label: "Uso do Celular", value: 3.8 },
    ],
    "2024": [
      { label: "Frequência", value: 4.6 },
      { label: "Participação", value: 4.4 },
      { label: "Desempenho", value: 4.7 },
      { label: "Comportamento", value: 4.8 },
      { label: "Fardamento", value: 4.3 },
      { label: "Uso do Celular", value: 4.0 },
    ],
    "2025": [
      { label: "Frequência", value: 4.8 },
      { label: "Participação", value: 4.6 },
      { label: "Desempenho", value: 4.9 },
      { label: "Comportamento", value: 5.0 },
      { label: "Fardamento", value: 4.5 },
      { label: "Uso do Celular", value: 4.2 },
    ],
  }

  const chartDataWithGeral: Record<string, ChartData[]> = {
    Geral: calcularMediaGeral(chartDataByYear),
    ...chartDataByYear,
  }

  const [avaliacao, setAvaliacao] = useState<Avaliacao>({
    frequencia: 0,
    participacao: 0,
    fardamento: 0,
    desempenho: 0,
    comportamento: 0,
    usoCelular: 0,
  })

  const handleSelect = (campo: keyof Avaliacao, valor: number) => {
    setAvaliacao((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  const Rating = ({ label, campo }: RatingProps) => (
    <div className={styles.ratingGroup}>
      <span className={styles.label}>{label}</span>
      <div className={styles.buttons}>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            className={`${styles.button} ${
              avaliacao[campo] === num ? styles.active : ""
            }`}
            onClick={() => handleSelect(campo, num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <Header />

      <BreadCrumb
        items={[
          { label: "Página Inicial", to: "/" },
          { label: "Classificações", to: "/classificacao/:id" },
        ]}
      />

      <div className={styles.container}>
        <p className={styles.titledc}>Informática 4º Vespertino <b>#1</b></p>
        <p className={styles.subtitledc}>
        </p>

        <div className={styles.cardsGrid}>
          {cards.map((card, index) => (
            <div key={index} className={styles.card}>
              <img src={card.icon} alt={card.title} />
              <div className={styles.cardInfo}>
                <span className={styles.cardTitle}>
                  {card.title}
                </span>
                <strong className={styles.cardScore}>5.0</strong>
              </div>
              <span className={styles.rank}>#1</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.switchContainer}>
        <div className={styles.switchButtons}>
          <button
            className={activeTab === "grafico" ? styles.active : ""}
            onClick={() => setActiveTab("grafico")}
          >
            Gráfico de Desempenho
          </button>

          <button
            className={activeTab === "avaliar" ? styles.active : ""}
            onClick={() => setActiveTab("avaliar")}
          >
            Avaliar
          </button>
        </div>

        {activeTab === "grafico" && (
          <div className={styles.graphContainer}>
            <div className={styles.filters}>
              {years.map((year) => (
                <button
                  key={year}
                  className={
                    selectedYear === year
                      ? styles.filterActive
                      : ""
                  }
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className={styles.graphPlaceholder}>
              <RadarPerformanceChart
                data={chartDataWithGeral[selectedYear]}
              />
            </div>
          </div>
        )}

        {activeTab === "avaliar" && (
          <div className={styles.evaluateContainer}>
            <h3 className={styles.h3_evaluation_class}>
              Avalie a turma Informática - 4 - V
            </h3>

            <div className={styles.grid}>
              <Rating label="Frequência" campo="frequencia" />
              <Rating label="Fardamento" campo="fardamento" />
              <Rating label="Participação" campo="participacao" />
              <Rating label="Desempenho" campo="desempenho" />
              <Rating label="Comportamento" campo="comportamento" />
              <Rating label="Uso de Celular" campo="usoCelular" />
            </div>

            <div className={styles.actions}>
              <button className={styles.cancel}>Cancelar</button>
              <button className={styles.confirm}>Confirmar</button>
            </div>
          </div>
        )}
      </div>

      {activeTab === "avaliar" && (
        <div className={styles.commentsContainer}>
          <h3 className={styles.commentsTitle}>Comentários</h3>

          <p className={styles.commentsClass}>
            Informática 4 Vespertino
          </p>

          <div className={styles.commentsList}>
            <div className={styles.commentItem}>
              <strong>Sergio Pérez</strong>
              <span>21 nov. de 2025</span>
              <p>Turma muito participativa.</p>
            </div>

            <div className={styles.commentItem}>
              <strong>Ana Silva</strong>
              <span>22 nov. de 2025</span>
              <p>
                Bom desempenho geral, mas precisam melhorar a
                frequência.
              </p>
            </div>
          </div>

          <div className={styles.newComment}>
            <input
              type="text"
              placeholder="Adicionar comentário..."
            />
            <button className={styles.postButton}>
              Postar
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
