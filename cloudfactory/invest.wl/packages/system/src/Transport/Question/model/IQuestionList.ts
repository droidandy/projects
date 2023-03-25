import { EQuestionSection, IQuestionDTO } from './IQuizDTO';

export interface IQuestionListRequest {
  sections: EQuestionSection[] | string;
  // Флаг возвращать ответы пользователя. false - нет, true - да
  answer_mode: boolean;
}

export interface IQuestionListResponse {
  question: IQuestionDTO[];
}
