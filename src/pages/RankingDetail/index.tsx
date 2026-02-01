import Header from "../../components/Header"
import BreadCrumb from "../../components/BreadCrumb"
import styles from "./RankingDetail.module.css"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import Phone from "../../assets/logo-phone.png"
import Participation from "../../assets/participation-icon.png"
import Performance from "../../assets/perfomance-icon.png"
import Frequency from "../../assets/frequency-icon.png"
import Uniform from "../../assets/uniform-icon.png"
import Behavior from "../../assets/behavior-icon.png"
import Footer from "../../components/Footer"
import RadarPerformanceChart from "../../components/RadarPerformanceChart"
import { useClassPerformanceByYear } from "../../hooks/performance/useClassPerformanceByYear"

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

export default function Classifications() {
  const { id } = useParams()
  const classId = Number(id)

  const cards = [
    { key: "cellPhoneUse", title: "Uso do Celular", icon: Phone },
    { key: "participation", title: "Participação", icon: Participation },
    { key: "performance", title: "Desempenho", icon: Performance },
    { key: "frequency", title: "Frequência", icon: Frequency },
    { key: "unifirm", title: "Fardamento", icon: Uniform },
    { key: "behavior", title: "Comportamento", icon: Behavior },
  ] as const

  const [activeTab, setActiveTab] = useState<"avaliar" | "grafico">("grafico")
  const [selectedYear, setSelectedYear] = useState<string>("2026")

  const years = ["2026", "2027", "2028", "2029"]

  const { data, loading, error, refresh } = useClassPerformanceByYear(
    Number.isFinite(classId) ? classId : undefined,
    Number(selectedYear)
  )

  const titleText = data
    ? `${data.courseName} ${data.gradleLevel} ${data.shift}`
    : "Turma"

  const averageText = data ? data.averageScore.toFixed(1) : "-"
  const averageRankText = data ? `#${data.rank.averageRank}` : "#-"

  const radarData: ChartData[] = useMemo(() => {
    if (!data) return []

    return [
      { label: "Frequência", value: data.frequencyScore },
      { label: "Participação", value: data.participationScore },
      { label: "Desempenho", value: data.performanceScore },
      { label: "Comportamento", value: data.behaviorScore },
      { label: "Fardamento", value: data.unifirmScore },
      { label: "Uso do Celular", value: data.cellPhoneUseScore },
    ]
  }, [data])

  const getCardScoreAndRank = (key: (typeof cards)[number]["key"]) => {
    if (!data) return { score: "-", rank: "-" }

    switch (key) {
      case "frequency":
        return {
          score: data.frequencyScore.toFixed(1),
          rank: `#${data.rank.frequencyRank}`,
        }
      case "unifirm":
        return {
          score: data.unifirmScore.toFixed(1),
          rank: `#${data.rank.unifirmRank}`,
        }
      case "behavior":
        return {
          score: data.behaviorScore.toFixed(1),
          rank: `#${data.rank.behaviorRank}`,
        }
      case "participation":
        return {
          score: data.participationScore.toFixed(1),
          rank: `#${data.rank.participationRank}`,
        }
      case "performance":
        return {
          score: data.performanceScore.toFixed(1),
          rank: `#${data.rank.performanceRank}`,
        }
      case "cellPhoneUse":
        return {
          score: data.cellPhoneUseScore.toFixed(1),
          rank: `#${data.rank.cellPhoneUseRank}`,
        }
      default:
        return { score: "-", rank: "-" }
    }
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
    setAvaliacao((prev) => ({ ...prev, [campo]: valor }))
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
          { label: "Turma", to: `/classificacao/${id}` },
        ]}
      />

      <div className={styles.container}>
        <p className={styles.titledc}>
          {titleText} <b>{averageRankText}</b>
        </p>

        <p className={styles.subtitledc}>

        </p>

        {error && (
          <div style={{ marginTop: 8 }}>
            <p style={{ marginBottom: 6 }}>{error}</p>
            <button onClick={refresh}>Tentar novamente</button>
          </div>
        )}

        <div className={styles.cardsGrid}>
          {cards.map((card, index) => {
            const { score, rank } = getCardScoreAndRank(card.key)

            return (
              <div key={index} className={styles.card}>
                <img src={card.icon} alt={card.title} />
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{card.title}</span>
                  <strong className={styles.cardScore}>
                    {loading ? "..." : score}
                  </strong>
                </div>
                <span className={styles.rank}>{loading ? "#..." : rank}</span>
              </div>
            )
          })}
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
                  className={selectedYear === year ? styles.filterActive : ""}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className={styles.graphPlaceholder}>
              {loading ? (
                <p>Carregando gráfico...</p>
              ) : (
                <RadarPerformanceChart data={radarData} />
              )}
            </div>
          </div>
        )}

        {activeTab === "avaliar" && (
          <div className={styles.evaluateContainer}>
            <h3 className={styles.h3_evaluation_class}>Avalie a turma</h3>

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

          <p className={styles.commentsClass}>Informática 4 Vespertino</p>

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
                Bom desempenho geral, mas precisam melhorar a frequência.
              </p>
            </div>
          </div>

          <div className={styles.newComment}>
            <input type="text" placeholder="Adicionar comentário..." />
            <button className={styles.postButton}>Postar</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
