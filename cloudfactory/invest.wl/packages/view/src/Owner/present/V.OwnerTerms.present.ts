import { Inject, Injectable } from '@invest.wl/core';
import { IVRouterService, VRouterServiceTid } from '../../Router/V.Router.types';
import { IVOwnerConfig, VOwnerConfigTid } from '../V.Owner.types';

export const VOwnerTermsPresentTid = Symbol.for('VOwnerTermsPresentTid');

export interface IVOwnerTermsPresentProps {
}

@Injectable()
export class VOwnerTermsPresent {
  // @observable private _props?: IVOwnerTermsPresentProps;
  public text = this._cfg.text;

  constructor(
    @Inject(VRouterServiceTid) private _router: IVRouterService,
    @Inject(VOwnerConfigTid) private _cfg: IVOwnerConfig,
  ) {}

  public init(props: IVOwnerTermsPresentProps) {
    // this._props = props;
  }

  public accept = () => this._router.back();
}
