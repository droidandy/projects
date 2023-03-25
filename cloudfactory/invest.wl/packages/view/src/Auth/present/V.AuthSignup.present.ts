import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DAuthSignupCase, DAuthSignupCaseTid, IDAuthSignupCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VAuthSignupModel, VAuthSignupModelTid } from '../model/V.AuthSignup.model';

export const VAuthSignupPresentTid = Symbol.for('VAuthSignupPresentTid');

export interface IVAuthSignupPresentProps extends IDAuthSignupCaseProps {
}

@Injectable()
export class VAuthSignupPresent {
  @observable.ref public props?: IVAuthSignupPresentProps;

  public model = new this.modelSignup(this.cse.model);

  constructor(
    @Inject(DAuthSignupCaseTid) public cse: DAuthSignupCase,
    @Inject(VAuthSignupModelTid) private modelSignup: Newable<typeof VAuthSignupModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVAuthSignupPresentProps) {
    this.props = props;
    this.cse.init(props);
  }

  public signup = async () => {
    this.model.dirtySet();
    // await this.caseSignup.signup();
  };
}
