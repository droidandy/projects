import { IDAuthUser, Injectable, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputEmailModel } from '../../Input/model/D.InputEmail.model';
import { DInputFioModel } from '../../Input/model/D.InputFio.model';
import { DInputPhoneModel } from '../../Input/model/D.InputPhone.model';

export const DAuthSignupModelTid = Symbol.for('DAuthSignupModelTid');
type TDTO = Typify<IDAuthUser>;

export interface IDAuthSignupModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DAuthSignupModel extends DInputFormModel<TDTO> implements IDAuthSignupModel {
  constructor() {
    super({
      fio: new DInputFioModel({ validatorList: [DInputValidator.required] }),
      phone: new DInputPhoneModel({ validatorList: [DInputValidator.required] }),
      email: new DInputEmailModel({ validatorList: [DInputValidator.required] }),
    });
  }
}
