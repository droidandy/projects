import { Inject, Injectable, Newable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DAuthSignupModel, DAuthSignupModelTid } from '../model/D.AuthSignup.model';

export const DAuthSignupCaseTid = Symbol.for('DAuthSignupCaseTid');

export interface IDAuthSignupCaseProps {
}

@Injectable()
export class DAuthSignupCase {
  @observable.ref public props?: IDAuthSignupCaseProps;

  @observable public isBusy = false;
  @observable public codeSent = false;

  public model = new this._signupModel();
  public requestId?: string;

  constructor(
    @Inject(DAuthSignupModelTid) private _signupModel: Newable<typeof DAuthSignupModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDAuthSignupCaseProps) {
    this.props = props;
  }
}
