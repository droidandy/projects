import { Injectable } from '@invest.wl/core';
import { IDAuthPasswordRestoreModel } from '@invest.wl/domain';
import { VInputFioEmailModel } from '../../Input/model/V.InputFioEmail.model';
import { VInputPassportNumModel } from '../../Input/model/V.InputPassportNum.model';
import { VInputPassportSerialModel } from '../../Input/model/V.InputPassportSerial.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VAuthPasswordRestoreModelTid = Symbol.for('VAuthPasswordRestoreModelTid');

export interface IVAuthPasswordRestoreModel extends IVInputFormModel<IDAuthPasswordRestoreModel> {
}

@Injectable()
export class VAuthPasswordRestoreModel extends VInputFormModel<IDAuthPasswordRestoreModel> implements IVAuthPasswordRestoreModel {
  public fields = {
    fioEmail: new VInputFioEmailModel(this.domain.fields.fioEmail),
    serial: new VInputPassportSerialModel(this.domain.fields.serial),
    num: new VInputPassportNumModel(this.domain.fields.num),
  };
}
