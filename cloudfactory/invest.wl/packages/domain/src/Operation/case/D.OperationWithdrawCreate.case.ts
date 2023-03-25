import { Injectable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';

export const DOperationWithdrawCreateCaseTid = Symbol.for('DOperationWithdrawCreateCaseTid');

export interface IDOperationWithdrawCreateCaseProps {

}

@Injectable()
export class DOperationWithdrawCreateCase {
  @observable.ref public props?: IDOperationWithdrawCreateCaseProps;

  constructor(
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDOperationWithdrawCreateCaseProps) {
    this.props = props;
  }
}
