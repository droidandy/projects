import { Inject, Injectable, Newable } from '@invest.wl/core';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { EDTimerBgName } from '../../Timer/D.Timer.types';
import { DTimerBgModel } from '../../Timer/model/D.TimerBg.model';
import { DAuthConfig } from '../D.Auth.config';
import { DAuthGateway } from '../D.Auth.gateway';
import { DAuthService } from '../D.Auth.service';
import { DAuthConfigTid, DAuthGatewayTid, DAuthServiceTid } from '../D.Auth.types';
import { DAuthSigninModel, DAuthSigninModelTid } from '../model/D.AuthSignin.model';

export const DAuthSigninCaseTid = Symbol.for('DAuthSigninCaseTid');

export interface IDAuthSigninCaseProps {
}

export interface IDAuthSigninCase {
  props?: IDAuthSigninCaseProps;
  isBusy: boolean;
  timer: DTimerBgModel;
  model: DAuthSigninModel;
  init(props: IDAuthSigninCaseProps): Promise<void>;
  dispose(): void;
  codeResend(): Promise<void>;
  prepare(): Promise<any>;
  confirm(): Promise<void>;
  codeClean(): void;
}

@Injectable()
export class DAuthSigninCase implements IDAuthSigninCase {
  @observable.ref public props?: IDAuthSigninCaseProps;

  @observable public isBusy = false;
  public timer = new DTimerBgModel({ name: EDTimerBgName.AuthSigninConfirm });
  public model = new this._signinModel({ codeLength: this._cfg.smsCodeLength });

  constructor(
    @Inject(DAuthServiceTid) private _service: DAuthService,
    @Inject(DAuthConfigTid) private _cfg: DAuthConfig,
    @Inject(DAuthGatewayTid) private _gw: DAuthGateway,
    @Inject(DAuthSigninModelTid) private _signinModel: Newable<typeof DAuthSigninModel>,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public async init(props: IDAuthSigninCaseProps) {
    this.props = props;
  }

  public dispose() {
    this.timer.clear().then();
  }

  @action.bound
  public async codeResend() {
    if (!this.model.isValid) throw this._errorService.businessHandle('Неверный логин-пароль');
    try {
      this.isBusy = true;
      // TODO: make it
      // await this.gw.Prepare(this.Model.AsDTO);
      await this.timer.start(this._cfg.smsCodeResendInterval);
    } finally {
      runInAction(() => this.isBusy = false);
    }
  };

  @action.bound
  public async prepare() {
    if (!this.model.isValid) throw this._errorService.businessHandle('Неверный логин-пароль');
    try {
      this.isBusy = true;
      const res = await this._gw.loginPrepare(this.model.asDTO);
      await this.timer.start(this._cfg.smsCodeResendInterval);
      return res;
    } finally {
      runInAction(() => {
        this.isBusy = false;
        this.model.code.valueSet(undefined);
      });
    }
  }

  @action.bound
  public async confirm() {
    if (!this.model.code.isValid) throw this._errorService.businessHandle('Неверный код подтверждения');
    try {
      this.isBusy = true;
      const res = await this._gw.loginConfirm({ code: this.model.code.value! });
      await this._service.signIn(res, this.model.asDTO);
      await this.timer.clear();
      this.model.clear();
      this.codeClean();
    } finally {
      runInAction(() => {
        this.isBusy = false;
        this.model.code.valueSet(undefined);
      });
    }
  };

  @action.bound
  public codeClean() {
    this.model.code.valueSet(undefined);
  }
}
