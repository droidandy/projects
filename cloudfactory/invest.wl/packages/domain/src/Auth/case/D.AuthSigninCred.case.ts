import { Inject, Injectable, Newable } from '@invest.wl/core';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { DAuthConfig } from '../D.Auth.config';
import { DAuthGateway } from '../D.Auth.gateway';
import { DAuthService } from '../D.Auth.service';
import { DAuthConfigTid, DAuthGatewayTid, DAuthServiceTid } from '../D.Auth.types';
import { DAuthSigninModel, DAuthSigninModelTid } from '../model/D.AuthSignin.model';

export const DAuthSigninCredCaseTid = Symbol.for('DAuthSigninCredCaseTid');

export interface IDAuthSigninCredCaseProps {
}

@Injectable()
export class DAuthSigninCredCase {
  @observable.ref public props?: IDAuthSigninCredCaseProps;
  @observable public isBusy = false;

  public model = new this._signinModel({ codeLength: this._const.smsCodeLength });

  constructor(
    @Inject(DAuthConfigTid) private _const: DAuthConfig,
    @Inject(DAuthServiceTid) private _service: DAuthService,
    @Inject(DAuthGatewayTid) private _gw: DAuthGateway,
    @Inject(DAuthSigninModelTid) private _signinModel: Newable<typeof DAuthSigninModel>,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public async init(props: IDAuthSigninCredCaseProps) {
    this.props = props;
  }

  @action.bound
  public async login() {
    if (!this.model.isValid) throw this._errorService.businessHandle('Неверный логин-пароль');
    try {
      this.isBusy = true;
      const res = await this._gw.login(this.model.asDTO);
      await this._service.signIn(res, this.model.asDTO);
    } finally {
      runInAction(() => (this.isBusy = false));
    }
  };
}
