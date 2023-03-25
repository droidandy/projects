import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { EVAuthScreen } from '@invest.wl/view/src/Auth/V.Auth.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';

export const VLayoutEntryPresentTid = Symbol.for('VLayoutEntryPresentTid');

@Injectable()
export class VLayoutEntryPresent {
  constructor(
    @Inject(VRouterServiceTid) private _router: IVRouterService,
  ) { }

  public register = () => this._router.navigateTo(EVAuthScreen.AuthSignup);
  public login = () => this._router.navigateTo(EVAuthScreen.AuthSignin);
  public passwordRestore = () => this._router.navigateTo(EVAuthScreen.AuthPasswordRestore);
}
