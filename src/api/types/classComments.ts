export interface ClassComment {
  id: number;
  comment: string;
  professorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassCommentRequest {
  comment: string;
}

export interface UpdateClassCommentRequest {
  comment: string;
}

export type DeleteClassCommentResponse = void;
