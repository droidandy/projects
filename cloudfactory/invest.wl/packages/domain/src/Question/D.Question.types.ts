import {
  IApiResponse,
  IDQuestionAnswerSaveRequestDTO,
  IDQuestionAnswerSaveResponseDTO,
  IDQuestionListRequestDTO,
  IDQuestionListResponseDTO,
  IDQuestionSectionListRequestDTO,
  IDQuestionSectionListResponseDTO,
} from '@invest.wl/core';

export const DQuestionAdapterTid = Symbol.for('DQuestionAdapterTid');
export const DQuestionStoreTid = Symbol.for('DQuestionStoreTid');
export const DQuestionGatewayTid = Symbol.for('DQuestionGatewayTid');

export interface IDQuestionAdapter {
  list(req: IDQuestionListRequestDTO): Promise<IApiResponse<IDQuestionListResponseDTO>>;
  answerSave(req: IDQuestionAnswerSaveRequestDTO): Promise<IApiResponse<IDQuestionAnswerSaveResponseDTO>>;
  sectionList(req: IDQuestionSectionListRequestDTO): Promise<IApiResponse<IDQuestionSectionListResponseDTO>>;
}
