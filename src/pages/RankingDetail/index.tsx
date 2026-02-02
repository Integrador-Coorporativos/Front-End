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
import { useClassComments } from "../../hooks/comments/useClassComments"
import { useCreateEvaluation } from "../../hooks/evaluation/useCreateEvaluation"
import { useCreateClassComment } from "../../hooks/comments/useCreateClassComment"

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

function formatDatePtBR(dateStr: string) {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
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

  const {
    data: performanceData,
    loading: performanceLoading,
    error: performanceError,
    refresh: refreshPerformance,
  } = useClassPerformanceByYear(
    Number.isFinite(classId) ? classId : undefined,
    Number(selectedYear)
  )

  const {
    data: comments,
    loading: commentsLoading,
    error: commentsError,
    refresh: refreshComments,
  } = useClassComments(Number.isFinite(classId) ? classId : undefined)

  const {
    loading: creatingEvaluation,
    error: createEvaluationError,
    submitEvaluation,
  } = useCreateEvaluation()

  const [successMsg, setSuccessMsg] = useState<string>("")

  const titleText = performanceData
    ? `${performanceData.courseName} ${performanceData.gradleLevel} ${performanceData.shift}`
    : "Turma"

  const averageRankText = performanceData
    ? `#${performanceData.rank.averageRank}`
    : "#-"

  const radarData: ChartData[] = useMemo(() => {
    if (!performanceData) return []

    return [
      { label: "Frequência", value: performanceData.frequencyScore },
      { label: "Participação", value: performanceData.participationScore },
      { label: "Desempenho", value: performanceData.performanceScore },
      { label: "Comportamento", value: performanceData.behaviorScore },
      { label: "Fardamento", value: performanceData.unifirmScore },
      { label: "Uso do Celular", value: performanceData.cellPhoneUseScore },
    ]
  }, [performanceData])

  const getCardScoreAndRank = (key: (typeof cards)[number]["key"]) => {
    if (!performanceData) return { score: "-", rank: "-" }

    switch (key) {
      case "frequency":
        return {
          score: performanceData.frequencyScore.toFixed(1),
          rank: `#${performanceData.rank.frequencyRank}`,
        }
      case "unifirm":
        return {
          score: performanceData.unifirmScore.toFixed(1),
          rank: `#${performanceData.rank.unifirmRank}`,
        }
      case "behavior":
        return {
          score: performanceData.behaviorScore.toFixed(1),
          rank: `#${performanceData.rank.behaviorRank}`,
        }
      case "participation":
        return {
          score: performanceData.participationScore.toFixed(1),
          rank: `#${performanceData.rank.participationRank}`,
        }
      case "performance":
        return {
          score: performanceData.performanceScore.toFixed(1),
          rank: `#${performanceData.rank.performanceRank}`,
        }
      case "cellPhoneUse":
        return {
          score: performanceData.cellPhoneUseScore.toFixed(1),
          rank: `#${performanceData.rank.cellPhoneUseRank}`,
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
    setSuccessMsg("")
  }

  const resetAvaliacao = () => {
    setAvaliacao({
      frequencia: 0,
      participacao: 0,
      fardamento: 0,
      desempenho: 0,
      comportamento: 0,
      usoCelular: 0,
    })
    setSuccessMsg("")
  }

  const isAvaliacaoValida = useMemo(() => {
    const values = Object.values(avaliacao)
    return values.every((v) => v >= 1 && v <= 5)
  }, [avaliacao])

  const handleConfirmEvaluation = async () => {
    setSuccessMsg("")

    if (!Number.isFinite(classId)) {
      setSuccessMsg("Turma inválida.")
      return
    }

    if (!isAvaliacaoValida) {
      setSuccessMsg("Preencha todas as notas (1 a 5) antes de confirmar.")
      return
    }

    const result = await submitEvaluation(classId, {
      frequencyScore: avaliacao.frequencia,
      unifirmScore: avaliacao.fardamento,
      behaviorScore: avaliacao.comportamento,
      participationScore: avaliacao.participacao,
      performanceScore: avaliacao.desempenho,
      cellPhoneUseScore: avaliacao.usoCelular,
    })

    if (result) {
      setSuccessMsg(
        `Avaliação registrada! (ID: ${result.id}) • Média: ${result.averageScore.toFixed(
          1
        )} • Data: ${formatDatePtBR(result.date)}`
      )
      refreshPerformance()
      resetAvaliacao()
    }
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
            type="button"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  )

  const [newComment, setNewComment] = useState<string>("")
  const [commentMsg, setCommentMsg] = useState<string>("")

  const {
    submit: submitComment,
    loading: creatingComment,
    error: createCommentError,
  } = useCreateClassComment({
    onSuccess: () => {
      setNewComment("")
      setCommentMsg("Comentário enviado!")
      refreshComments()
      setTimeout(() => setCommentMsg(""), 2500)
    },
  })

  const isCommentValid = useMemo(() => {
    return newComment.trim().length >= 2
  }, [newComment])

  const handlePostComment = async () => {
    setCommentMsg("")

    if (!Number.isFinite(classId)) {
      setCommentMsg("Turma inválida.")
      return
    }

    const text = newComment.trim()
    if (!text) {
      setCommentMsg("Digite um comentário antes de postar.")
      return
    }

    await submitComment(classId, { comment: text })
  }

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

        <p className={styles.subtitledc}></p>

        {performanceError && (
          <div style={{ marginTop: 8 }}>
            <p style={{ marginBottom: 6 }}>{performanceError}</p>
            <button onClick={refreshPerformance} type="button">
              Tentar novamente
            </button>
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
                    {performanceLoading ? "..." : score}
                  </strong>
                </div>
                <span className={styles.rank}>
                  {performanceLoading ? "#..." : rank}
                </span>
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
            type="button"
          >
            Gráfico de Desempenho
          </button>

          <button
            className={activeTab === "avaliar" ? styles.active : ""}
            onClick={() => setActiveTab("avaliar")}
            type="button"
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
                  type="button"
                >
                  {year}
                </button>
              ))}
            </div>

            <div className={styles.graphPlaceholder}>
              {performanceLoading ? (
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

            {createEvaluationError && (
              <div style={{ marginTop: 10, marginBottom: 10 }}>
                <p>{createEvaluationError}</p>
              </div>
            )}

            {successMsg && (
              <div style={{ marginTop: 10, marginBottom: 10 }}>
                <p>{successMsg}</p>
              </div>
            )}

            <div className={styles.grid}>
              <Rating label="Frequência" campo="frequencia" />
              <Rating label="Fardamento" campo="fardamento" />
              <Rating label="Participação" campo="participacao" />
              <Rating label="Desempenho" campo="desempenho" />
              <Rating label="Comportamento" campo="comportamento" />
              <Rating label="Uso de Celular" campo="usoCelular" />
            </div>

            <div className={styles.actions}>
              <button
                className={styles.cancel}
                type="button"
                onClick={resetAvaliacao}
                disabled={creatingEvaluation}
              >
                Cancelar
              </button>

              <button
                className={styles.confirm}
                type="button"
                onClick={handleConfirmEvaluation}
                disabled={creatingEvaluation || !isAvaliacaoValida}
                title={
                  !isAvaliacaoValida
                    ? "Preencha todas as notas (1 a 5) antes de confirmar."
                    : undefined
                }
              >
                {creatingEvaluation ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        )}
      </div>

      {activeTab === "avaliar" && (
        <div className={styles.commentsContainer}>
          <h3 className={styles.commentsTitle}>Comentários</h3>

          <p className={styles.commentsClass}>{titleText}</p>

          {commentsError && (
            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <p style={{ marginBottom: 6 }}>{commentsError}</p>
              <button onClick={refreshComments} type="button">
                Tentar novamente
              </button>
            </div>
          )}

          <div className={styles.commentsList}>
            {commentsLoading ? (
              <p>Carregando comentários...</p>
            ) : comments.length === 0 ? (
              <p>Nenhum comentário ainda.</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className={styles.commentItem}>
                  <strong>{c.professorName}</strong>
                  <span>{formatDatePtBR(c.createdAt)}</span>
                  <p>{c.comment}</p>
                </div>
              ))
            )}
          </div>

          {(createCommentError || commentMsg) && (
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              {createCommentError && <p>{createCommentError}</p>}
              {commentMsg && <p>{commentMsg}</p>}
            </div>
          )}

          <div className={styles.newComment}>
            <input
              type="text"
              placeholder="Adicionar comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={creatingComment}
            />
            <button
              className={styles.postButton}
              type="button"
              onClick={handlePostComment}
              disabled={creatingComment || !isCommentValid}
              title={!isCommentValid ? "Digite pelo menos 2 caracteres." : undefined}
            >
              {creatingComment ? "Postando..." : "Postar"}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
