import { IDBankAccountEditDTO, Injectable, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputBankAccountCorrModel } from '../../Input/model/D.InputBankAccountCorr.model';
import { DInputBankAccountCurrentModel } from '../../Input/model/D.InputBankAccountCurrent.model';
import { DInputBankAccountPersonalModel } from '../../Input/model/D.InputBankAccountPersonal.model';
import { DInputBankBikModel } from '../../Input/model/D.InputBankBik.model';
import { DInputBinaryModel, IDInputBinaryModel } from '../../Input/model/D.InputBinary.model';
import { DInputInnModel, EDInputInnType } from '../../Input/model/D.InputInn.model';
import { DInputKppModel } from '../../Input/model/D.InputKpp.model';
import { DInputStringModel } from '../../Input/model/D.InputString.model';

type TDTO = Typify<IDBankAccountEditDTO>;

export const DBankAccountEditModelTid = Symbol.for('DBankAccountEditModelTid');

export interface IDBankAccountEditModel extends IDInputFormModel<TDTO> {
  readonly isRequired: IDInputBinaryModel;
}

@Injectable()
export class DBankAccountEditModel extends DInputFormModel<TDTO> implements IDBankAccountEditModel {
  public isRequired = new DInputBinaryModel().valueSet(true);

  constructor() {
    super({
      accountCurrent: new DInputBankAccountCurrentModel({ validatorList: () => this.isRequired.isChecked ? [DInputValidator.required] : undefined })
        .disabledSet(() => !this.isRequired.isChecked),
      accountPersonal: new DInputBankAccountPersonalModel().disabledSet(() => !this.isRequired.isChecked),
      currency: {
        Name: new DInputStringModel({ validatorList: () => this.isRequired.isChecked ? [DInputValidator.required] : undefined })
          .disabledSet(() => !this.isRequired.isChecked),
      },
      bank: {
        name: new DInputStringModel({ validatorList: () => this.isRequired.isChecked ? [DInputValidator.required] : undefined })
          .disabledSet(() => !this.isRequired.isChecked),
        bik: new DInputBankBikModel({ validatorList: () => this.isRequired.isChecked ? [DInputValidator.required] : undefined })
          .disabledSet(() => !this.isRequired.isChecked),
        inn: new DInputInnModel({ type: EDInputInnType.Legal })
          .disabledSet(() => !this.isRequired.isChecked),
        kpp: new DInputKppModel()
          .disabledSet(() => !this.isRequired.isChecked),
        accountCorr: new DInputBankAccountCorrModel()
          .disabledSet(() => !this.isRequired.isChecked),
        swift: new DInputStringModel()
          .disabledSet(() => !this.isRequired.isChecked),
      },
    });
  }
}
