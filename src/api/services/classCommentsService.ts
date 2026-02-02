import api from "../api";
import type { ClassComment, CreateClassCommentRequest } from "../types/classComments";

export const getClassComments = async (
  classId: number
): Promise<ClassComment[]> => {
  const response = await api.get<ClassComment[]>(
    `/api/classes/${classId}/comments`
  );
  return response.data;
};

export const createClassComment = async (
  classId: number,
  payload: CreateClassCommentRequest
): Promise<ClassComment> => {
  const response = await api.post<ClassComment>(`/api/classes/${classId}/comments`, payload);
  return response.data;
};
