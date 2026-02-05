import api from "../api";
import type { ClassComment, CreateClassCommentRequest, UpdateClassCommentRequest, DeleteClassCommentResponse } from "../types/classComments";

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

export const updateClassComment = async (
  classId: number,
  commentId: number,
  payload: UpdateClassCommentRequest
): Promise<ClassComment> => {
  const response = await api.put<ClassComment>(
    `/api/classes/${classId}/comments/${commentId}`,
    payload
  );
  return response.data;
};

export const deleteClassComment = async (
  classId: number,
  commentId: number
): Promise<DeleteClassCommentResponse> => {
  await api.delete(`/api/classes/${classId}/comments/${commentId}`);
};
