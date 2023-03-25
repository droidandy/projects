import { Injectable } from '@invest.wl/core';
import { IDCustomerContactEditModel } from '@invest.wl/domain';
import { VInputBinaryModel } from '../../Input/model/V.InputBinary.model';
import { VInputEmailModel } from '../../Input/model/V.InputEmail.model';
import { VInputPhoneModel } from '../../Input/model/V.InputPhone.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VCustomerContactEditModelTid = Symbol.for('VCustomerContactEditModelTid');

class IVInputBinaryModel<T> {
}

export interface IVCustomerContactEditModel extends IVInputFormModel<IDCustomerContactEditModel> {
  readonly isEmailReportSame: IVInputBinaryModel<boolean>;
}

@Injectable()
export class VCustomerContactEditModel extends VInputFormModel<IDCustomerContactEditModel> implements IVCustomerContactEditModel {
  public isEmailReportSame = new VInputBinaryModel(this.domain.isEmailReportSame);

  public fields = {
    phone: new VInputPhoneModel(this.domain.fields.phone),
    email: new VInputEmailModel(this.domain.fields.email),
    emailReport: new VInputEmailModel(this.domain.fields.emailReport),
  };
}
