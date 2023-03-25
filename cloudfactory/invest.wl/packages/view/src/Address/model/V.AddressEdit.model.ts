import { Injectable } from '@invest.wl/core';
import { IDAddressEditModel } from '@invest.wl/domain';
import { VInputIdModel } from '../../Input/model/V.InputId.model';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VAddressEditModelTid = Symbol.for('VAddressEditModelTid');

export interface IVAddressEditModel extends IVInputFormModel<IDAddressEditModel> {
}

@Injectable()
export class VAddressEditModel extends VInputFormModel<IDAddressEditModel> implements IVAddressEditModel {
  public fields = {
    guid: new VInputIdModel(this.domain.fields.guid),
    full: new VInputStringModel(this.domain.fields.full),
    country: new VInputStringModel(this.domain.fields.country),
    city: new VInputStringModel(this.domain.fields.city),
    street: new VInputStringModel(this.domain.fields.street),
    house: new VInputStringModel(this.domain.fields.house),
    block: new VInputStringModel(this.domain.fields.block),
    flat: new VInputStringModel(this.domain.fields.flat),
    flatId: new VInputIdModel(this.domain.fields.flatId),
    houseId: new VInputIdModel(this.domain.fields.houseId),
  };
}
