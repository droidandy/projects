import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DAuthSigninCredCase, DAuthSigninCredCaseTid } from '@invest.wl/domain';
import { VAuthSigninModel, VAuthSigninModelTid } from '../../model/V.AuthSignin.model';
import { IVAuthSigninCredPresent, IVAuthSigninCredPresentProps } from './V.AuthSigninCred.types';

@Injectable()
export class VAuthSigninCredPresent implements IVAuthSigninCredPresent {
  public model = new this.modelSignin(this.caseSignin.model);

  constructor(
    @Inject(DAuthSigninCredCaseTid) public caseSignin: DAuthSigninCredCase,
    @Inject(VAuthSigninModelTid) private modelSignin: Newable<typeof VAuthSigninModel>,
  ) { }

  public async init(props: IVAuthSigninCredPresentProps) {
    await this.caseSignin.init(props);
    if (__DEV__) {
      this.model.fields.login.onChangeText('u1');
      this.model.fields.password.onChangeText('123');
    }
  }

  public signin = async () => {
    this.model.dirtySet();
    await this.caseSignin.login();
  };
}
