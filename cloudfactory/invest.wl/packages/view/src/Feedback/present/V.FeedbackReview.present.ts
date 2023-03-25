import { Inject, Injectable } from '@invest.wl/core';
import { DFeedbackReviewCase, DFeedbackReviewCaseTid, IDFeedbackReviewCaseProps } from '@invest.wl/domain';
import { action, makeObservable } from 'mobx';

export const VFeedbackReviewPresentTid = Symbol.for('VFeedbackReviewPresentTid');

export interface IVFeedbackReviewPresentProps extends IDFeedbackReviewCaseProps {
}

@Injectable()
export class VFeedbackReviewPresent {
  constructor(
    @Inject(DFeedbackReviewCaseTid) public cse: DFeedbackReviewCase,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVFeedbackReviewPresentProps) {
    this.cse.init(props);
  }
}
