import { IDInstrumentAlertSetRequestDTO, Injectable, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputIdModel } from '../../Input/model/D.InputId.model';
import { DInputNumberModel } from '../../Input/model/D.InputNumber.model';
import { DInputStringModel } from '../../Input/model/D.InputString.model';

export const DInstrumentAlertSetModelTid = Symbol.for('DInstrumentAlertSetModelTid');
type TDTO = Typify<IDInstrumentAlertSetRequestDTO>;

export interface IDInstrumentAlertSetModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DInstrumentAlertSetModel extends DInputFormModel<TDTO> implements IDInstrumentAlertSetModel {
  constructor() {
    super({
      id: new DInputIdModel({ validatorList: [DInputValidator.required] }).valueSet('0'),
      targetPrice: new DInputNumberModel({ validatorList: [DInputValidator.required] }),
      instrumentId: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      classCode: new DInputStringModel(),
      secureCode: new DInputStringModel(),
    });
  }
}
