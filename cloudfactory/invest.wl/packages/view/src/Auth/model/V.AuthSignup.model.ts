import { Injectable } from '@invest.wl/core';
import { IDAuthSignupModel } from '@invest.wl/domain';
import { VInputEmailModel } from '../../Input/model/V.InputEmail.model';
import { VInputFioModel } from '../../Input/model/V.InputFio.model';
import { VInputPhoneModel } from '../../Input/model/V.InputPhone.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VAuthSignupModelTid = Symbol.for('VAuthSignupModelTid');

export interface IVAuthSignupModel extends IVInputFormModel<IDAuthSignupModel> {
}

@Injectable()
export class VAuthSignupModel extends VInputFormModel<IDAuthSignupModel> implements IVAuthSignupModel {
  public fields = {
    fio: new VInputFioModel(this.domain.fields.fio),
    phone: new VInputPhoneModel(this.domain.fields.phone),
    email: new VInputEmailModel(this.domain.fields.email),
  };
}
