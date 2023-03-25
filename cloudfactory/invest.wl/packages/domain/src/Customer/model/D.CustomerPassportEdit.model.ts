import { ILambda, LambdaX } from '@invest.wl/common';
import { IDCustomerPassportDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputDateModel } from '../../Input/model/D.InputDate.model';
import { DInputNumberModel } from '../../Input/model/D.InputNumber.model';
import { DInputPassportDepartmentModel } from '../../Input/model/D.InputPassportDepartment.model';
import { DInputPassportNumModel } from '../../Input/model/D.InputPassportNum.model';
import { DInputPassportSerialModel } from '../../Input/model/D.InputPassportSerial.model';
import { DInputStringModel } from '../../Input/model/D.InputString.model';

type TDTO = IDCustomerPassportDTO;

export const DCustomerPassportEditModelTid = Symbol.for('DCustomerPassportEditModelTid');

export interface IDCustomerPassportEditModel extends IDInputFormModel<TDTO> {
}

export interface IDCustomerPassportEditModelProps {
  required?: ILambda<(keyof TDTO)[] | undefined>;
}

@Injectable()
export class DCustomerPassportEditModel extends DInputFormModel<TDTO> implements IDCustomerPassportEditModel {
  @computed
  private get _required() {
    return LambdaX.resolve(this._props.required) || [];
  }

  constructor(private _props: IDCustomerPassportEditModelProps) {
    super({
      nameFirst: new DInputStringModel({ validatorList: () => !this._required.includes('nameFirst') ? undefined : [DInputValidator.required] }),
      nameMiddle: new DInputStringModel(),
      nameLast: new DInputStringModel({ validatorList: () => !this._required.includes('nameLast') ? undefined : [DInputValidator.required] }),
      birthDate: new DInputDateModel({ validatorList: () => !this._required.includes('birthDate') ? undefined : [DInputValidator.required] }),
      birthPlace: new DInputStringModel({ validatorList: () => !this._required.includes('birthPlace') ? undefined : [DInputValidator.required] }),
      gender: new DInputNumberModel({ validatorList: () => !this._required.includes('gender') ? undefined : [DInputValidator.required] }),
      issueDate: new DInputDateModel({ validatorList: () => !this._required.includes('issueDate') ? undefined : [DInputValidator.required] }),
      issueDepartCode: new DInputPassportDepartmentModel({ validatorList: () => !this._required.includes('issueDepartCode') ? undefined : [DInputValidator.required] }),
      issueDepartName: new DInputStringModel({ validatorList: () => !this._required.includes('issueDepartName') ? undefined : [DInputValidator.required] }),
      number: new DInputPassportNumModel({ validatorList: () => !this._required.includes('number') ? undefined : [DInputValidator.required] }),
      serial: new DInputPassportSerialModel({ validatorList: () => !this._required.includes('serial') ? undefined : [DInputValidator.required] }),
    });
    makeObservable(this);
  }
}
