import { Injectable } from '@invest.wl/core';

import { IDBankAccountEditModel, IDInputInnModel } from '@invest.wl/domain';
import { VInputBankAccountCorrModel } from '../../Input/model/V.InputBankAccountCorr.model';
import { VInputBankAccountCurrentModel } from '../../Input/model/V.InputBankAccountCurrent.model';
import { VInputBankAccountPersonalModel } from '../../Input/model/V.InputBankAccountPersonal.model';
import { VInputBankBikModel } from '../../Input/model/V.InputBankBik.model';
import { VInputBinaryModel } from '../../Input/model/V.InputBinary.model';
import { VInputInnModel } from '../../Input/model/V.InputInn.model';
import { VInputKppModel } from '../../Input/model/V.InputKpp.model';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VBankAccountEditModelTid = Symbol.for('VBankAccountEditModelTid');

export interface IVBankAccountEditModel extends IVInputFormModel<IDBankAccountEditModel> {
  readonly isRequired: VInputBinaryModel;
}

@Injectable()
export class VBankAccountEditModel extends VInputFormModel<IDBankAccountEditModel> implements IVBankAccountEditModel {
  public isRequired = new VInputBinaryModel(this.domain.isRequired);

  public fields = {
    accountCurrent: new VInputBankAccountCurrentModel(this.domain.fields.accountCurrent),
    accountPersonal: new VInputBankAccountPersonalModel(this.domain.fields.accountPersonal),
    currency: {
      Name: new VInputStringModel(this.domain.fields.currency.Name),
    },
    bank: {
      name: new VInputStringModel(this.domain.fields.bank.name),
      bik: new VInputBankBikModel(this.domain.fields.bank.bik),
      inn: new VInputInnModel(this.domain.fields.bank.inn as IDInputInnModel),
      kpp: new VInputKppModel(this.domain.fields.bank.kpp),
      accountCorr: new VInputBankAccountCorrModel(this.domain.fields.bank.accountCorr),
      swift: new VInputStringModel(this.domain.fields.bank.swift),
    },
  };
}
