import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DQuestionSectionListCase, DQuestionSectionListCaseTid, IDQuestionSectionListCaseProps } from '@invest.wl/domain';
import { VQuestionSectionModel, VQuestionSectionModelTid } from '../model/V.QuestionSection.model';

export const VQuestionSectionListPresentTid = Symbol.for('VQuestionSectionListPresentTid');

export interface IVQuestionSectionListPresentProps extends IDQuestionSectionListCaseProps {
}

@Injectable()
export class VQuestionSectionListPresent {
  public sectionListX = new MapX.VList(this.cse.sectionListX.source,
    () => this.cse.sectionListX.list, (m) => new this.sectionModel(m));

  constructor(
    @Inject(DQuestionSectionListCaseTid) public cse: DQuestionSectionListCase,
    @Inject(VQuestionSectionModelTid) private sectionModel: Newable<typeof VQuestionSectionModel>,
  ) { }

  public init(props: IVQuestionSectionListPresentProps) {
    return this.cse.init(props);
  }
}
