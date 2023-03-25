import { ILambda, LambdaX } from '@invest.wl/common';
import { IDAddressDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputIdModel } from '../../Input/model/D.InputId.model';
import { DInputStringModel } from '../../Input/model/D.InputString.model';

type TDTO = IDAddressDTO;

export const DAddressEditModelTid = Symbol.for('DAddressEditModelTid');

export interface IDAddressEditModel extends IDInputFormModel<TDTO> {
}

export interface IDAddressEditModelProps {
  required: ILambda<(keyof IDAddressDTO)[]>;
}

@Injectable()
export class DAddressEditModel extends DInputFormModel<TDTO> implements IDAddressEditModel {
  @computed
  private get _required() {
    return LambdaX.resolve(this._props.required) || [];
  }

  constructor(private _props: IDAddressEditModelProps) {
    super({
      guid: new DInputIdModel({ validatorList: () => this._required.includes('guid') ? [DInputValidator.required] : undefined }),
      full: new DInputStringModel({ validatorList: () => this._required.includes('full') ? [DInputValidator.required] : undefined }),
      country: new DInputStringModel({ validatorList: () => this._required.includes('country') ? [DInputValidator.required] : undefined }),
      city: new DInputStringModel({ validatorList: () => this._required.includes('city') ? [DInputValidator.required] : undefined }),
      street: new DInputStringModel({ validatorList: () => this._required.includes('street') ? [DInputValidator.required] : undefined }),
      house: new DInputStringModel({ validatorList: () => this._required.includes('house') ? [DInputValidator.required] : undefined }),
      block: new DInputStringModel({ validatorList: () => this._required.includes('block') ? [DInputValidator.required] : undefined }),
      flat: new DInputStringModel({ validatorList: () => this._required.includes('flat') ? [DInputValidator.required] : undefined }),
      houseId: new DInputIdModel({ validatorList: () => this._required.includes('houseId') ? [DInputValidator.required] : undefined }),
      flatId: new DInputIdModel({ validatorList: () => this._required.includes('flatId') ? [DInputValidator.required] : undefined }),
    });
    makeObservable(this);
  }
}
