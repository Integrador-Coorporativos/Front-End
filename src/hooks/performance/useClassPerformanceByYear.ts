import { useEffect, useState } from "react"
import { getClassPerformanceByYear } from "@/api/services/performanceService"
import type { ClassPerformanceByYearResponse, Bimestre } from "@/api/types/performance"

export function useClassPerformanceByYear(
  classId?: number,
  year?: number,
  bimestre?: Bimestre
) {
  const [data, setData] = useState<ClassPerformanceByYearResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    if (!Number.isFinite(classId) || !Number.isFinite(year) || !bimestre) return

    setLoading(true)
    setError(null)

    try {
      const result = await getClassPerformanceByYear(classId!, year!, bimestre)
      setData(result)
    } catch (err: any) {
      console.error("Erro no hook useClassPerformanceByYear:", err)
      console.log("STATUS:", err?.response?.status)
      console.log("DATA:", err?.response?.data)

      setData(null)
      setError("Sem dados para o ano/bimestre selecionado.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [classId, year, bimestre])

  return { data, loading, error, refresh: loadData }
}
