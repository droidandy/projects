import { Inject, Injectable } from '@invest.wl/core';
import { DAuthCase, DAuthCaseTid, DSecuritySettingCase, DSecuritySettingCaseTid, IDSecuritySettingCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { EVLayoutScreen } from '../../Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '../../Router/V.Router.types';

export const VSecurityAccessBiometryPresentTid = Symbol.for('VSecurityAccessBiometryPresentTid');

export interface IVSecurityAccessBiometryPresentProps extends IDSecuritySettingCaseProps {
}

@Injectable()
export class VSecurityAccessBiometryPresent {
  @observable.ref public props?: IVSecurityAccessBiometryPresentProps;

  constructor(
    @Inject(DSecuritySettingCaseTid) public settingCase: DSecuritySettingCase,
    @Inject(DAuthCaseTid) private _authCase: DAuthCase,
    @Inject(VRouterServiceTid) private _router: IVRouterService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVSecurityAccessBiometryPresentProps) {
    this.props = props;
    this.settingCase.init(props);
  }

  public access = async () => {
    await this.settingCase.authSigninByBioSet(true);
    this.mainGo();
  };
  public mainGo = () => this._router.resetTo(EVLayoutScreen.LayoutMain);
  public signOut = () => this._authCase.signOut();
}
