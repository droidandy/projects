import { Inject, Injectable } from '@invest.wl/core';
import { DApplicationVersionCase, DApplicationVersionCaseTid, IDApplicationVersionCaseProps } from '@invest.wl/domain';
import { action, makeObservable } from 'mobx';

export const VApplicationVersionPresentTid = Symbol.for('VApplicationVersionPresentTid');

export interface IVApplicationVersionPresentProps extends IDApplicationVersionCaseProps {
}

@Injectable()
export class VApplicationVersionPresent {
  constructor(
    @Inject(DApplicationVersionCaseTid) public cse: DApplicationVersionCase,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVApplicationVersionPresentProps) {
    this.cse.init(props);
  }
}
