import { ILambda, LambdaX } from '@invest.wl/common';
import { IDCustomerContactDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputBinaryModel, IDInputBinaryModel } from '../../Input/model/D.InputBinary.model';
import { DInputEmailModel } from '../../Input/model/D.InputEmail.model';
import { DInputPhoneModel } from '../../Input/model/D.InputPhone.model';

type TDTO = IDCustomerContactDTO;

export const DCustomerContactEditModelTid = Symbol.for('DCustomerContactEditModelTid');

export interface IDCustomerContactEditModel extends IDInputFormModel<TDTO> {
  readonly isEmailReportSame: IDInputBinaryModel<boolean>;
}

export interface IDCustomerContactEditModelProps {
  required?: ILambda<(keyof TDTO)[] | undefined>;
}

@Injectable()
export class DCustomerContactEditModel extends DInputFormModel<TDTO> implements IDCustomerContactEditModel {
  @computed
  private get _required() {
    return LambdaX.resolve(this._props.required) || [];
  }

  public isEmailReportSame = new DInputBinaryModel<boolean>();

  constructor(private _props: IDCustomerContactEditModelProps) {
    super({
      phone: new DInputPhoneModel({ validatorList: () => !this._required.includes('phone') ? undefined : [DInputValidator.required] }),
      email: new DInputEmailModel({ validatorList: () => !this._required.includes('email') ? undefined : [DInputValidator.required] }),
      emailReport: new DInputEmailModel({
        validatorList: () => !this._required.includes('emailReport') || !!this.isEmailReportSame.value
          ? undefined : [DInputValidator.required],
      }),
    });
    makeObservable(this);
  }
}
