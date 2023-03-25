import { IDAuthPasswordRestore, Injectable, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputFioEmailModel } from '../../Input/model/D.InputFioEmail.model';
import { DInputPassportNumModel } from '../../Input/model/D.InputPassportNum.model';
import { DInputPassportSerialModel } from '../../Input/model/D.InputPassportSerial.model';

export const DAuthPasswordRestoreModelTid = Symbol.for('DAuthPasswordRestoreModelTid');
type TDTO = Typify<IDAuthPasswordRestore>;

export interface IDAuthPasswordRestoreModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DAuthPasswordRestoreModel extends DInputFormModel<TDTO> implements IDAuthPasswordRestoreModel {
  constructor() {
    super({
      fioEmail: new DInputFioEmailModel({ validatorList: [DInputValidator.required] }),
      serial: new DInputPassportSerialModel({ validatorList: [DInputValidator.required] }),
      num: new DInputPassportNumModel({ validatorList: [DInputValidator.required] }),
    });
  }
}
