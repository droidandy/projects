import { IQuestionSectionDTO } from './IQuizDTO';

export interface ISectionListRequest {
}

export interface ISectionListResponse {
  section: IQuestionSectionDTO[];
}
