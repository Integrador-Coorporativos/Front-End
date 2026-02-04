import Header from "../../components/Header"
import BreadCrumb from "../../components/BreadCrumb"
import styles from "./RankingDetail.module.css"
import { useMemo, useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useParams } from "react-router-dom"

import Phone from "../../assets/logo-phone.png"
import Participation from "../../assets/participation-icon.png"
import Performance from "../../assets/perfomance-icon.png"
import Frequency from "../../assets/frequency-icon.png"
import Uniform from "../../assets/uniform-icon.png"
import Behavior from "../../assets/behavior-icon.png"
import { LoadingState, ErrorState } from "@/components/FeedbackStates/FeedbackStates"
import Footer from "../../components/Footer"
import RadarPerformanceChart from "../../components/RadarPerformanceChart"

import { useClassPerformanceByYear } from "../../hooks/performance/useClassPerformanceByYear"
import { useClassComments } from "../../hooks/comments/useClassComments"
import { useCreateEvaluation } from "../../hooks/evaluation/useCreateEvaluation"
import { useCreateClassComment } from "../../hooks/comments/useCreateClassComment"
import { useDeleteClassComment } from "../../hooks/comments/useDeleteClassComment"
import { useUpdateClassComment } from "../../hooks/comments/useUpdateClassComment"

import type { Bimestre } from "@/api/types/performance"

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

function getCurrentBimestre(): Bimestre {
  const m = new Date().getMonth() + 1
  if (m <= 3) return 1
  if (m <= 6) return 2
  if (m <= 9) return 3
  return 4
}

const fmt = (n: unknown) =>
  typeof n === "number" && Number.isFinite(n) ? n.toFixed(1) : "-"

const fmtRank = (n: unknown) =>
  typeof n === "number" && Number.isFinite(n) ? `#${n}` : "#-"

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
  const [selectedBimestre, setSelectedBimestre] = useState<Bimestre>(
    getCurrentBimestre()
  )

  const years = ["2026", "2025", "2024", "2023"]
  const bimestres: { value: Bimestre; label: string }[] = [
    { value: 1, label: "1º Bim." },
    { value: 2, label: "2º Bim." },
    { value: 3, label: "3º Bim." },
    { value: 4, label: "4º Bim." },
  ]

  const {
    data: performanceData,
    loading: performanceLoading,
    refresh: refreshPerformance,
    error
  } = useClassPerformanceByYear(
    Number.isFinite(classId) ? classId : undefined,
    Number(selectedYear),
    selectedBimestre
  )

  const {
    data: comments,
    loading: commentsLoading,
    refresh: refreshComments,
  } = useClassComments(Number.isFinite(classId) ? classId : undefined)

  const commentsArray = useMemo(() => {
    return Array.isArray(comments) ? comments : []
  }, [comments])

  const { loading: creatingEvaluation, submitEvaluation } = useCreateEvaluation()

  const titleText = performanceData
    ? `${performanceData.courseName} ${performanceData.gradleLevel} ${performanceData.shift}`
    : "Turma"

  const averageRankText = fmtRank(performanceData?.rank?.averageRank)

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
    if (!performanceData) return { score: "-", rank: "#-" }

    switch (key) {
      case "frequency":
        return {
          score: fmt(performanceData.frequencyScore),
          rank: fmtRank(performanceData.rank?.frequencyRank),
        }
      case "unifirm":
        return {
          score: fmt(performanceData.unifirmScore),
          rank: fmtRank(performanceData.rank?.unifirmRank),
        }
      case "behavior":
        return {
          score: fmt(performanceData.behaviorScore),
          rank: fmtRank(performanceData.rank?.behaviorRank),
        }
      case "participation":
        return {
          score: fmt(performanceData.participationScore),
          rank: fmtRank(performanceData.rank?.participationRank),
        }
      case "performance":
        return {
          score: fmt(performanceData.performanceScore),
          rank: fmtRank(performanceData.rank?.performanceRank),
        }
      case "cellPhoneUse":
        return {
          score: fmt(performanceData.cellPhoneUseScore),
          rank: fmtRank(performanceData.rank?.cellPhoneUseRank),
        }
      default:
        return { score: "-", rank: "#-" }
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

  const resetAvaliacao = () => {
    setAvaliacao({
      frequencia: 0,
      participacao: 0,
      fardamento: 0,
      desempenho: 0,
      comportamento: 0,
      usoCelular: 0,
    })
  }

  const isAvaliacaoValida = useMemo(() => {
    const values = Object.values(avaliacao)
    return values.every((v) => v >= 1 && v <= 5)
  }, [avaliacao])

  const handleConfirmEvaluation = async () => {
    if (!Number.isFinite(classId)) return
    if (!isAvaliacaoValida) return

    const result = await submitEvaluation(classId, {
      frequencyScore: avaliacao.frequencia,
      unifirmScore: avaliacao.fardamento,
      behaviorScore: avaliacao.comportamento,
      participationScore: avaliacao.participacao,
      performanceScore: avaliacao.desempenho,
      cellPhoneUseScore: avaliacao.usoCelular,
    })

    if (result) {
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

  const { submit: submitComment, loading: creatingComment } =
    useCreateClassComment({
      onSuccess: () => {
        setNewComment("")
        refreshComments()
      },
    })

  const isCommentValid = useMemo(
    () => newComment.trim().length >= 2,
    [newComment]
  )

  const handlePostComment = async () => {
    if (!Number.isFinite(classId)) return
    const text = newComment.trim()
    if (!text) return
    await submitComment(classId, { comment: text })
  }

  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null
  )
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({})

  const { submit: deleteComment, loading: deletingComment } = useDeleteClassComment(
    {
      onSuccess: () => refreshComments(),
    }
  )

  const { submit: updateComment, loading: updatingComment } = useUpdateClassComment(
    {
      onSuccess: () => refreshComments(),
    }
  )

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState<string>("")

  const openMenu = (commentId: number) => {
    const btn = buttonRefs.current[commentId]
    if (!btn) return

    const rect = btn.getBoundingClientRect()

    const MENU_HEIGHT = 92
    const MENU_WIDTH = 160
    const GAP = 8

    const spaceBelow = window.innerHeight - rect.bottom
    const openUp = spaceBelow < MENU_HEIGHT + GAP

    const top = openUp ? rect.top - MENU_HEIGHT - GAP : rect.bottom + GAP

    const idealLeft = rect.right - MENU_WIDTH
    const left = Math.max(8, Math.min(idealLeft, window.innerWidth - MENU_WIDTH - 8))

    setMenuPos({ top, left })
    setOpenMenuId(commentId)
  }

  const closeMenu = () => {
    setOpenMenuId(null)
    setMenuPos(null)
  }

  const handleOpenEdit = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId)
    setEditingText(currentText)
    closeMenu()
  }

  const handleSaveEdit = async (commentId: number) => {
    if (!Number.isFinite(classId)) return
    const text = editingText.trim()
    if (text.length < 2) return

    await updateComment(classId, commentId, { comment: text })

    setEditingCommentId(null)
    setEditingText("")
  }

  const handleDelete = async (commentId: number) => {
    if (!Number.isFinite(classId)) return
    await deleteComment(classId, commentId)

    closeMenu()
    if (editingCommentId === commentId) {
      setEditingCommentId(null)
      setEditingText("")
    }
  }

  useEffect(() => {
    if (openMenuId === null) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node

      if (menuRef.current?.contains(target)) return

      const btn = buttonRefs.current[openMenuId]
      if (btn?.contains(target)) return

      closeMenu()
    }

    const onScrollOrResize = () => closeMenu()

    window.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("resize", onScrollOrResize)
    window.addEventListener("scroll", onScrollOrResize, true)

    return () => {
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("resize", onScrollOrResize)
      window.removeEventListener("scroll", onScrollOrResize, true)
    }
  }, [openMenuId])

  return (
    <div>
      <Header />

        {performanceLoading ? ( //inicio 
          <LoadingState message="Carregando Dados da turma..." />
        ) : error ? (
          <ErrorState 
            message={error || "Erro ao carregar dados da turma."} 
            onRetry={() => window.location.reload()} 
          />
        ) : (//fim
          <>

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

        <div className={styles.cardsGrid}>
          {cards.map((card, index) => {
            const { score, rank } = getCardScoreAndRank(card.key)

            return (
              <div key={index} className={styles.card}>
                <img src={card.icon} alt={card.title} />
                <div className={styles.cardInfo}>
                  <span className={styles.cardTitle}>{card.title}</span>
                  <strong className={styles.cardScore}>
                    {performanceLoading ? "-" : score}
                  </strong>
                </div>
                <span className={styles.rank}>
                  {performanceLoading ? "#-" : rank}
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
            <div className={styles.filtersPanel}>
              <div className={styles.filterBlock}>
                <p className={styles.filterTitle}>Ano</p>
                <div className={styles.bimestreFilters}>
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
              </div>

              <div className={styles.filterBlock}>
                <p className={styles.filterTitle}>Bimestre</p>
                <div className={styles.bimestreFilters}>
                  {bimestres.map((b) => (
                    <button
                      key={b.value}
                      className={
                        selectedBimestre === b.value ? styles.filterActive : ""
                      }
                      onClick={() => setSelectedBimestre(b.value)}
                      type="button"
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.graphPlaceholder}>
              <RadarPerformanceChart data={radarData} />
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

          <div className={styles.commentsList}>
            {!commentsLoading &&
              commentsArray.map((c) => (
                <div key={c.id} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentHeaderLeft}>
                      <strong>{c.professorName}</strong>
                      <span>{formatDatePtBR(c.createdAt)}</span>
                    </div>

                    <button
                      className={styles.moreButton}
                      type="button"
                      ref={(el) => {
                        buttonRefs.current[c.id] = el
                      }}
                      onClick={() => {
                        if (openMenuId === c.id) closeMenu()
                        else openMenu(c.id)
                      }}
                      aria-label="Abrir menu do comentário"
                    >
                      ⋯
                    </button>
                  </div>

                  {editingCommentId === c.id ? (
                    <div className={styles.editBox}>
                      <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        disabled={updatingComment}
                      />

                      <button
                        type="button"
                        className={styles.saveBtn}
                        onClick={() => handleSaveEdit(c.id)}
                        disabled={updatingComment || editingText.trim().length < 2}
                      >
                        {updatingComment ? "Salvando..." : "Salvar"}
                      </button>

                      <button
                        type="button"
                        className={styles.cancelEditBtn}
                        onClick={() => {
                          setEditingCommentId(null)
                          setEditingText("")
                        }}
                        disabled={updatingComment}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <p>{c.comment}</p>
                  )}
                </div>
              ))}
          </div>

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
            >
              {creatingComment ? "Postando..." : "Postar"}
            </button>
          </div>
        </div>
      )}

      {openMenuId !== null &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.portalMenu}
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <button
              type="button"
              onClick={() => {
                const current = commentsArray.find((x) => x.id === openMenuId)
                if (!current) return
                handleOpenEdit(openMenuId, current.comment)
              }}
            >
              Editar
            </button>

            <button
              type="button"
              className={styles.delete}
              onClick={() => handleDelete(openMenuId)}
              disabled={deletingComment}
            >
              {deletingComment ? "Excluindo..." : "Excluir"}
            </button>
          </div>,
          document.body
        )}

         </>
        )}

      <Footer />
    </div>
  )
}
