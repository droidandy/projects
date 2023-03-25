import { AsynX, IAsynXOpts, MapX } from '@invest.wl/common';
import { IDQuestionAnswerSaveRequestDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { DQuestionAdapterTid, IDQuestionAdapter } from './D.Question.types';
import { DQuestionUtil } from './D.Question.util';
import { DQuestionModel, DQuestionModelTid } from './model/D.Question.model';
import { DQuestionSectionModel, DQuestionSectionModelTid } from './model/D.QuestionSection.model';

@Injectable()
export class DQuestionGateway {
  constructor(
    @Inject(DQuestionAdapterTid) private adapter: IDQuestionAdapter,
    @Inject(DQuestionModelTid) private model: Newable<typeof DQuestionModel>,
    @Inject(DQuestionSectionModelTid) private sectionModel: Newable<typeof DQuestionSectionModel>,
  ) {}

  public list(opts: IAsynXOpts<IDQuestionAdapter['list']>) {
    const source = new AsynX(this.adapter.list.bind(this.adapter), opts);
    return new MapX.DList(source, () => DQuestionUtil.order(source.data?.data), lv => new this.model(lv));
  }

  public sectionList(opts: IAsynXOpts<IDQuestionAdapter['sectionList']>) {
    const source = new AsynX(this.adapter.sectionList.bind(this.adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this.sectionModel(lv));
  }

  public answerSave(req: IDQuestionAnswerSaveRequestDTO) {
    return this.adapter.answerSave(req);
  }
}
