import { IQuestionSaveDTO } from './IQuizDTO';

export interface IQuestionSaveRequest {
  questions: IQuestionSaveDTO[];
}

export interface IQuestionSaveResponse {
  status: number | string;
  message?: string;
}
