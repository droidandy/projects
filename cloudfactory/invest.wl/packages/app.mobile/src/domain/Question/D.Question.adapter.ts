import {
  EDQuestionDisplayType,
  IApiResponse,
  IDQuestionAnswerSaveRequestDTO,
  IDQuestionAnswerSaveResponseDTO,
  IDQuestionDTO,
  IDQuestionListRequestDTO,
  IDQuestionListResponseDTO,
  IDQuestionSectionDTO,
  IDQuestionSectionListRequestDTO,
  IDQuestionSectionListResponseDTO,
  Inject,
  Injectable,
} from '@invest.wl/core';
import { IDQuestionAdapter } from '@invest.wl/domain/src/Question/D.Question.types';
import { STransportQuestionService, STransportQuestionServiceTid } from '@invest.wl/system/src/Transport/Question/S.TransportQuestion.service';

@Injectable()
export class DQuestionAdapter implements IDQuestionAdapter {
  constructor(
    @Inject(STransportQuestionServiceTid) private _tp: STransportQuestionService,
  ) {}

  public list(req: IDQuestionListRequestDTO): Promise<IApiResponse<IDQuestionListResponseDTO>> {
    return this._tp.List({ answer_mode: req.answerWith ?? false, sections: req.sectionList.join() })
      .then(res => ({
        code: 0, data: res.question.map(q => ({
          ...q, ordering: q.show_order, optionList: q.options,
          displayType: q.type as unknown as EDQuestionDisplayType, required: !!q.required,
        } as IDQuestionDTO)),
      }));
  }

  public answerSave(req: IDQuestionAnswerSaveRequestDTO): Promise<IApiResponse<IDQuestionAnswerSaveResponseDTO>> {
    return this._tp.Save({ questions: req.list.map(a => ({ question_id: a.questionId, value: a.value })) })
      .then(res => ({ code: 0, data: res }));
  }

  public sectionList(req: IDQuestionSectionListRequestDTO): Promise<IApiResponse<IDQuestionSectionListResponseDTO>> {
    return this._tp.SectionList(req)
      .then(res => ({
        code: 0, data: res.section.map(s => ({
          ...s, questionCount: s.quiz_questions?.aggregate?.count || 0, name: s.caption,
        } as IDQuestionSectionDTO)),
      }));
  }
}
