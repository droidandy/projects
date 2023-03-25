import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DSecurityAccessCase, DSecurityAccessCaseTid, DSecurityConfig, DSecurityConfigTid, IDSecurityAccessCaseProps } from '@invest.wl/domain';
import { action, computed, makeObservable, observable } from 'mobx';
import { EVLayoutScreen } from '../../Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '../../Router/V.Router.types';
import { VSecurityCodeModel, VSecurityCodeModelTid } from '../model/V.SecurityCode.model';
import { EVSecurityScreen } from '../V.Security.types';

export const VSecurityAccessCodePresentTid = Symbol.for('VSecurityAccessCodePresentTid');

export interface IVSecurityAccessCodePresentProps extends IDSecurityAccessCaseProps {
}

@Injectable()
export class VSecurityAccessCodePresent {
  @observable.ref public props?: IVSecurityAccessCodePresentProps;
  public model = new this.modelCode(this.cse.codeModel);

  @observable public isBusy: boolean = false;

  constructor(
    @Inject(DSecurityAccessCaseTid) public cse: DSecurityAccessCase,
    @Inject(VRouterServiceTid) private _router: IVRouterService,
    @Inject(DSecurityConfigTid) private _const: DSecurityConfig,
    @Inject(VSecurityCodeModelTid) private modelCode: Newable<typeof VSecurityCodeModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVSecurityAccessCodePresentProps) {
    this.props = props;
    this.cse.init(props);
  }

  @computed
  public get pinCodeLength() {
    return this._const.codeLength;
  }

  public accessRequest = async (code: string) => {
    this.model.fields.code.valueInputSet(code);
    await this.cse.accessRequestCode();
    this._router.resetTo(this.cse.biometryHas ? EVSecurityScreen.SecurityAccessBiometry : EVLayoutScreen.LayoutMain);
  };
}
