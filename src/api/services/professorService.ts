// @ts-ignore
import api from "../http"; 
import type { Professor } from "../../types/Professor";

export const professorService = {
  getAll: async (): Promise<Professor[]> => {
    try {
      const { data } = await api.get("/api/admin-panel/professor");
      
      const mapeado = data.map((prof: any) => ({
        id: prof.id,
        name: prof.name || prof.Name, 
        email: prof.email || prof.Email,
        registration: prof.registration,
        quantityStudents: prof.quantityStudents,
        quantityClass: prof.quantityClass,
      }));

      return mapeado;
    } catch (error) {
      console.error("ERRO NA CHAMADA DA API:", error);
      throw error;
    }
  },
};