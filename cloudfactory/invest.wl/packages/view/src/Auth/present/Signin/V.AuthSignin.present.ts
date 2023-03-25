import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DAuthConfig, DAuthConfigTid, DAuthSigninCase, DAuthSigninCaseTid } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VTimerBgModel } from '../../../Timer/model/V.TimerBg.model';
import { VAuthSigninModel, VAuthSigninModelTid } from '../../model/V.AuthSignin.model';
import { IVAuthSigninPresent, IVAuthSigninPresentProps } from './V.AuthSignin.types';

@Injectable()
export class VAuthSigninPresent implements IVAuthSigninPresent {
  @observable.ref public props?: IVAuthSigninPresentProps;

  public model = new this.modelSignin(this.caseSignin.model);
  public timer = new VTimerBgModel(this.caseSignin.timer);

  constructor(
    @Inject(DAuthSigninCaseTid) public caseSignin: DAuthSigninCase,
    @Inject(VAuthSigninModelTid) private modelSignin: Newable<typeof VAuthSigninModel>,
    @Inject(DAuthConfigTid) private _cfg: DAuthConfig,
  ) {
    makeObservable(this);
  }

  @action
  public async init(props: IVAuthSigninPresentProps) {
    this.props = props;
    await this.caseSignin.init(props);
    if (__DEV__) {
      this.model.fields.login.onChangeText(this._cfg.loginDefault);
      this.model.fields.password.onChangeText(this._cfg.passwordDefault);
    }
  }

  public signin = async () => {
    this.model.dirtySet();
    return await this.caseSignin.prepare();
  };

  public confirm = async () => {
    this.model.code.dirtySet();
    await this.caseSignin.confirm();
    this.model.code.dirtySet(false);
  };
}
