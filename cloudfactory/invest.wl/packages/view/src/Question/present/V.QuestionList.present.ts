import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DQuestionListCase, DQuestionListCaseTid, IDQuestionListCaseProps } from '@invest.wl/domain';

import { VQuestionModel, VQuestionModelTid } from '../model/V.Question.model';

export const VQuestionListPresentTid = Symbol.for('VQuestionListPresentTid');

export interface IVQuestionListPresentProps extends IDQuestionListCaseProps {
}

@Injectable()
export class VQuestionListPresent {
  public listX = new MapX.VList(this.cse.listX.source,
    () => this.cse.listX.list, (m) => new this.model(m));

  constructor(
    @Inject(DQuestionListCaseTid) public cse: DQuestionListCase,
    @Inject(VQuestionModelTid) private model: Newable<typeof VQuestionModel>,
  ) { }

  public init(props: IVQuestionListPresentProps) {
    return this.cse.init(props);
  }
}
