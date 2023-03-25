import { IDQuestionDTO, TDQuestionSection } from './D.Question.dto';

export interface IDQuestionListRequestDTO {
  sectionList: TDQuestionSection[];
  // Флаг возвращать ответы пользователя. false - нет, true - да
  answerWith?: boolean;
}

export interface IDQuestionListResponseDTO extends Array<IDQuestionDTO> {
}
