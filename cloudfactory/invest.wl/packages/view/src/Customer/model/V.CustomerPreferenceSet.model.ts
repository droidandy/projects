import { Injectable } from '@invest.wl/core';
import { IDCustomerPreferenceSetModel } from '@invest.wl/domain';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VCustomerPreferenceSetModelTid = Symbol.for('VCustomerPreferenceSetModelTid');

export interface IVCustomerPreferenceSetModel extends IVInputFormModel<IDCustomerPreferenceSetModel> {
}

@Injectable()
export class VCustomerPreferenceSetModel extends VInputFormModel<IDCustomerPreferenceSetModel> implements IVCustomerPreferenceSetModel {
  public get fields() {
    const { fields } = this.domain;

    return {
      value: new VInputStringModel(fields.value),
      settingId: new VInputStringModel(fields.settingId),
    };
  }
}
