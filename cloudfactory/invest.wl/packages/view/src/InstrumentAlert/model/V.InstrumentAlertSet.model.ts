import { Injectable } from '@invest.wl/core';
import { IDInputNumberModel, IDInstrumentAlertSetModel } from '@invest.wl/domain';
import { makeObservable } from 'mobx';
import { VInputIdModel } from '../../Input/model/V.InputId.model';
import { VInputNumberModel } from '../../Input/model/V.InputNumber.model';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VInstrumentAlertSetModelTid = Symbol.for('VInstrumentAlertSetModelTid');

export interface IVInstrumentAlertSetModel extends IVInputFormModel<IDInstrumentAlertSetModel> {
}

@Injectable()
export class VInstrumentAlertSetModel extends VInputFormModel<IDInstrumentAlertSetModel> implements IVInstrumentAlertSetModel {
  public fields = {
    id: new VInputIdModel(this.domain.fields.id, { valueSetSkip: true }),
    instrumentId: new VInputIdModel(this.domain.fields.instrumentId, { valueSetSkip: true }),
    classCode: new VInputStringModel(this.domain.fields.classCode, { valueSetSkip: true }),
    secureCode: new VInputStringModel(this.domain.fields.secureCode, { valueSetSkip: true }),
    targetPrice: new VInputNumberModel(this.domain.fields.targetPrice as IDInputNumberModel),
  };

  constructor(domain: IDInstrumentAlertSetModel) {
    super(domain);
    makeObservable(this);
  }
}
