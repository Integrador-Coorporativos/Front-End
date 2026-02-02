import api from "../api";
import type { ClassComment } from "../types/classComments";

export const getClassComments = async (
  classId: number
): Promise<ClassComment[]> => {
  const response = await api.get<ClassComment[]>(
    `/api/classes/${classId}/comments`
  );
  return response.data;
};
