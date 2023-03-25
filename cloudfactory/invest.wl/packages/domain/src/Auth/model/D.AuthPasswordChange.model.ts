import { IDAuthPasswordChange, Injectable, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputPasswordModel } from '../../Input/model/D.InputPassword.model';

export const DAuthPasswordChangeModelTid = Symbol.for('DAuthPasswordChangeModelTid');
type TDTO = Typify<IDAuthPasswordChange>;

export interface IDAuthPasswordChangeModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DAuthPasswordChangeModel extends DInputFormModel<TDTO> implements IDAuthPasswordChangeModel {
  constructor() {
    super({
      passwordOld: new DInputPasswordModel({ validatorList: [DInputValidator.required] }),
      password: new DInputPasswordModel({ validatorList: [DInputValidator.required] }),
      passwordConfirm: new DInputPasswordModel({ validatorList: [DInputValidator.required] }).errorsSet(() =>
        this.fields.passwordConfirm.errorsValidator ?? (this.fields.password.value !== this.fields.passwordConfirm.value ? 'Пароли не совпадают' : undefined),
      ),
    });
  }
}
