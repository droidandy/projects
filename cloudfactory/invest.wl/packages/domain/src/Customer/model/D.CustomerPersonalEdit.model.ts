import { ILambda, LambdaX } from '@invest.wl/common';
import { IDCustomerPersonalDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputInnModel, EDInputInnType } from '../../Input/model/D.InputInn.model';
import { DInputSnilsModel } from '../../Input/model/D.InputSnils.model';

type TDTO = IDCustomerPersonalDTO;

export const DCustomerPersonalEditModelTid = Symbol.for('DCustomerPersonalEditModelTid');

export interface IDCustomerPersonalEditModel extends IDInputFormModel<TDTO> {
}

export interface IDCustomerPersonalEditModelProps {
  required?: ILambda<(keyof TDTO)[] | undefined>;
}

@Injectable()
export class DCustomerPersonalEditModel extends DInputFormModel<TDTO> implements IDCustomerPersonalEditModel {
  @computed
  private get _required() {
    return LambdaX.resolve(this._props.required) || [];
  }

  constructor(private _props: IDCustomerPersonalEditModelProps) {
    super({
      inn: new DInputInnModel({ validatorList: () => !this._required.includes('inn') ? undefined : [DInputValidator.required], type: EDInputInnType.Personal }),
      snils: new DInputSnilsModel({ validatorList: () => !this._required.includes('snils') ? undefined : [DInputValidator.required] }),
    });
    makeObservable(this);
  }
}
