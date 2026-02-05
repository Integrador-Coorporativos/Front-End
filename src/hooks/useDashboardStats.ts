import { useState, useEffect } from "react";
import { getDashboardMetrics } from "@/api/services/evaluationsService";
import type { DashboardMetrics } from "@/api/types/dashboard";

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Como o ID vem do Token no Back, a gente só dispara a carga uma vez no mount
    let isMounted = true;

    setLoading(true);
    getDashboardMetrics()
      .then((data) => {
        if (isMounted) setMetrics(data);
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Erro ao carregar dashboard do professor logado:", err);
          setError("Erro ao carregar métricas.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []); // Array vazio: executa apenas quando o componente nasce

  return { metrics, loading, error };
}