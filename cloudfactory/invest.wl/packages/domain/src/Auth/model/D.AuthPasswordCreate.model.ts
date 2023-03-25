import { IDAuthPasswordCreate, Injectable, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputPasswordModel } from '../../Input/model/D.InputPassword.model';

export const DAuthPasswordCreateModelTid = Symbol.for('DAuthPasswordCreateModelTid');
type TDTO = Typify<IDAuthPasswordCreate>;

export interface IDAuthPasswordCreateModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DAuthPasswordCreateModel extends DInputFormModel<TDTO> implements IDAuthPasswordCreateModel {
  constructor() {
    super({
      password: new DInputPasswordModel({ validatorList: [DInputValidator.required] }),
      passwordConfirm: new DInputPasswordModel({ validatorList: [DInputValidator.required] }).errorsSet(() =>
        this.fields.passwordConfirm.errorsValidator ?? (this.fields.password.value !== this.fields.passwordConfirm.value ? 'Пароли не совпадают' : undefined),
      ),
    });
  }
}
