import { Injectable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';

export const DFeedbackReviewCaseTid = Symbol.for('DFeedbackReviewCaseTid');

export interface IDFeedbackReviewCaseProps {
}

@Injectable()
export class DFeedbackReviewCase {
  @observable.ref public props?: IDFeedbackReviewCaseProps;

  constructor() {
    makeObservable(this);
  }

  @action
  public init(props: IDFeedbackReviewCaseProps) {
    this.props = props;
  }
}
