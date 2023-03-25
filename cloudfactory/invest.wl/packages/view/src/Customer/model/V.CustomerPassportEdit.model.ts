import { Injectable } from '@invest.wl/core';

import { IDCustomerPassportEditModel, IDInputNumberModel } from '@invest.wl/domain';
import { VInputDateModel } from '../../Input/model/V.InputDate.model';
import { VInputNumberModel } from '../../Input/model/V.InputNumber.model';
import { VInputPassportDepartmentModel } from '../../Input/model/V.InputPassportDepartment.model';
import { VInputPassportNumModel } from '../../Input/model/V.InputPassportNum.model';
import { VInputPassportSerialModel } from '../../Input/model/V.InputPassportSerial.model';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VCustomerPassportEditModelTid = Symbol.for('VCustomerPassportEditModelTid');

export interface IVCustomerPassportEditModel extends IVInputFormModel<IDCustomerPassportEditModel> {
}

@Injectable()
export class VCustomerPassportEditModel extends VInputFormModel<IDCustomerPassportEditModel> implements IVCustomerPassportEditModel {
  public fields = {
    nameFirst: new VInputStringModel(this.domain.fields.nameFirst),
    nameMiddle: new VInputStringModel(this.domain.fields.nameMiddle),
    nameLast: new VInputStringModel(this.domain.fields.nameLast),
    birthDate: new VInputDateModel(this.domain.fields.birthDate),
    birthPlace: new VInputStringModel(this.domain.fields.birthPlace),
    gender: new VInputNumberModel(this.domain.fields.gender as IDInputNumberModel),
    issueDate: new VInputDateModel(this.domain.fields.issueDate),
    issueDepartCode: new VInputPassportDepartmentModel(this.domain.fields.issueDepartCode),
    issueDepartName: new VInputStringModel(this.domain.fields.issueDepartName),
    number: new VInputPassportNumModel(this.domain.fields.number),
    serial: new VInputPassportSerialModel(this.domain.fields.serial),
  };
}
