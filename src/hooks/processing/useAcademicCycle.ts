import { useState } from "react";
// @ts-ignore
import api from "../../api/http/axiosInstance";

export const useAcademicCycle = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startNewPeriod = async (bimestre: string) => {
    setIsLoading(true);
    const stepNameMap: Record<string, string> = {
      "1": "PRIMEIRO",
      "2": "SEGUNDO",
      "3": "TERCEIRO",
      "4": "QUARTO"
    };

    try {
      await api.post("/api/admin-panel/evaluation-periods/start", {
        stepName: stepNameMap[bimestre],
        year: new Date().getFullYear()
      });
      return { success: true };
    } catch (error: any) {
      const msg = error.response?.data || "Erro ao iniciar período";
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return { startNewPeriod, isLoading };
};