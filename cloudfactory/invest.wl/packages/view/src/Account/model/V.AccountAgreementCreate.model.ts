import { EDAccountMarketType, Injectable, TModelId } from '@invest.wl/core';
import { IDAccountAgreementCreateModel, IDInputBinaryModel } from '@invest.wl/domain';
import { makeObservable, observable } from 'mobx';
import { VInputBinaryModel } from '../../Input/model/V.InputBinary.model';
import { VInputIdModel } from '../../Input/model/V.InputId.model';
import { VInputStringModel } from '../../Input/model/V.InputString.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VAccountAgreementCreateModelTid = Symbol.for('VAccountAgreementCreateModelTid');

export interface IVAccountAgreementCreateModel extends IVInputFormModel<IDAccountAgreementCreateModel> {
}

@Injectable()
export class VAccountAgreementCreateModel extends VInputFormModel<IDAccountAgreementCreateModel> implements IVAccountAgreementCreateModel {
  @observable.shallow public fields = {
    type: new VInputStringModel(this.domain.fields.type),
    tariffId: new VInputIdModel(this.domain.fields.tariffId),
    marketTypeList: this.domain.fields.marketTypeList.map((b) => new VInputBinaryModel<EDAccountMarketType>(b as any)),
    quikTypeList: [] as VInputBinaryModel<TModelId>[],
    singleLimit: new VInputBinaryModel(this.domain.fields.singleLimit as IDInputBinaryModel<boolean>),
    loan: new VInputBinaryModel(this.domain.fields.loan as IDInputBinaryModel<boolean>),
    IISOtherOwner: new VInputBinaryModel(this.domain.fields.IISOtherOwner as IDInputBinaryModel<boolean>),
  };

  constructor(domain: IDAccountAgreementCreateModel) {
    super(domain);
    makeObservable(this);
  }
}
