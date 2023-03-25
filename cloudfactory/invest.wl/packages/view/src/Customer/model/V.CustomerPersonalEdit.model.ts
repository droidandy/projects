import { Injectable } from '@invest.wl/core';
import { IDCustomerPersonalEditModel, IDInputInnModel } from '@invest.wl/domain';
import { VInputInnModel } from '../../Input/model/V.InputInn.model';
import { VInputSnilsModel } from '../../Input/model/V.InputSnils.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VCustomerPersonalEditModelTid = Symbol.for('VCustomerPersonalEditModelTid');

export interface IVCustomerPersonalEditModel extends IVInputFormModel<IDCustomerPersonalEditModel> {
}

@Injectable()
export class VCustomerPersonalEditModel extends VInputFormModel<IDCustomerPersonalEditModel> implements IVCustomerPersonalEditModel {
  public fields = {
    inn: new VInputInnModel(this.domain.fields.inn as IDInputInnModel),
    snils: new VInputSnilsModel(this.domain.fields.snils),
  };
}
