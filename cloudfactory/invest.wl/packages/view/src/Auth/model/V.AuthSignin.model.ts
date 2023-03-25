import { Injectable } from '@invest.wl/core';
import { IDAuthSigninModel } from '@invest.wl/domain';
import { VInputCodeModel } from '../../Input/model/V.InputCode.model';
import { VInputLoginModel } from '../../Input/model/V.InputLogin.model';
import { VInputPasswordModel } from '../../Input/model/V.InputPassword.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VAuthSigninModelTid = Symbol.for('VAuthSigninModelTid');

export interface IVAuthSigninModel extends IVInputFormModel<IDAuthSigninModel> {
  readonly code: VInputCodeModel;
}

@Injectable()
export class VAuthSigninModel extends VInputFormModel<IDAuthSigninModel> implements IVAuthSigninModel {
  public code = new VInputCodeModel(this.domain.code);

  public fields = {
    login: new VInputLoginModel(this.domain.fields.login),
    password: new VInputPasswordModel(this.domain.fields.password),
  };
}
