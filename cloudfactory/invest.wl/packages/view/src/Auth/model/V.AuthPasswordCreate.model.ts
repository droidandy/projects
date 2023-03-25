import { Injectable } from '@invest.wl/core';
import { IDAuthPasswordCreateModel } from '@invest.wl/domain';
import { VInputPasswordModel } from '../../Input/model/V.InputPassword.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VAuthPasswordCreateModelTid = Symbol.for('VAuthPasswordTempModelTid');

export interface IVAuthPasswordCreateModel extends IVInputFormModel<IDAuthPasswordCreateModel> {
}

@Injectable()
export class VAuthPasswordCreateModel extends VInputFormModel<IDAuthPasswordCreateModel> implements IVAuthPasswordCreateModel {
  public fields = {
    password: new VInputPasswordModel(this.domain.fields.password),
    passwordConfirm: new VInputPasswordModel(this.domain.fields.passwordConfirm),
  };
}
