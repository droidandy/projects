import { Injectable } from '@invest.wl/core';
import { IDAuthPasswordChangeModel } from '@invest.wl/domain';
import { VInputPasswordModel } from '../../Input/model/V.InputPassword.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VAuthPasswordChangeModelTid = Symbol.for('VAuthPasswordChangeModelTid');

export interface IVAuthPasswordChangeModel extends IVInputFormModel<IDAuthPasswordChangeModel> {
}

@Injectable()
export class VAuthPasswordChangeModel extends VInputFormModel<IDAuthPasswordChangeModel> implements IVAuthPasswordChangeModel {
  public fields = {
    passwordOld: new VInputPasswordModel(this.domain.fields.passwordOld),
    password: new VInputPasswordModel(this.domain.fields.password),
    passwordConfirm: new VInputPasswordModel(this.domain.fields.passwordConfirm),
  };
}
