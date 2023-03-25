import { EDAccountMarketType, IDAccountAgreementCreateRequestDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { Omit } from 'react-native';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputModel } from '../../Input/model/D.Input.model';
import { DInputBinaryModel } from '../../Input/model/D.InputBinary.model';
import { DInputIdModel } from '../../Input/model/D.InputId.model';

type TDTO = Omit<IDAccountAgreementCreateRequestDTO, 'bankAccount' | 'address' | 'marketTypeList'> & {
  marketTypeList: string[];
};

export const DAccountAgreementCreateModelTid = Symbol.for('DAccountAgreementCreateModelTid');

export interface IDAccountAgreementCreateModel extends IDInputFormModel<TDTO> {
}

// TODO: dynamic input list from props
// export interface IDAccountAgreementCreateModelProps {
//   marketTypeList: ILambda<ISelectItem<EDAccountMarketType>[] | undefined>;
//   quikTypeList: ILambda<ISelectItem<TModelId>[] | undefined>;
// }

@Injectable()
export class DAccountAgreementCreateModel extends DInputFormModel<TDTO> implements IDAccountAgreementCreateModel {
  constructor() {
    super({
      type: new DInputModel({ validatorList: [DInputValidator.required] }),
      tariffId: new DInputIdModel({ validatorList: [DInputValidator.required] }),
      marketTypeList: [
        new DInputBinaryModel({ values: [undefined, EDAccountMarketType.Fund] })
          .valueSet(() => (this.fields.singleLimit as DInputBinaryModel).isChecked ? EDAccountMarketType.Fund : EDAccountMarketType.Fund)
          .disabledSet(() => (this._isMinMarketTypeSelected && (this.fields.marketTypeList[0] as DInputBinaryModel).isChecked)
            || (this.fields.singleLimit as DInputBinaryModel).isChecked),
        new DInputBinaryModel({ values: [undefined, EDAccountMarketType.Currency] })
          .valueSet(() => (this.fields.singleLimit as DInputBinaryModel).isChecked ? EDAccountMarketType.Currency : EDAccountMarketType.Currency)
          .disabledSet(() => (this._isMinMarketTypeSelected && (this.fields.marketTypeList[1] as DInputBinaryModel).isChecked)
            || (this.fields.singleLimit as DInputBinaryModel).isChecked),
        new DInputBinaryModel({ values: [undefined, EDAccountMarketType.Term] })
          .disabledSet(() => this._isMinMarketTypeSelected && (this.fields.marketTypeList[2] as DInputBinaryModel).isChecked),
        new DInputBinaryModel({ values: [undefined, EDAccountMarketType.FundSPB] })
          .disabledSet(() => this._isMinMarketTypeSelected && (this.fields.marketTypeList[3] as DInputBinaryModel).isChecked),
        new DInputBinaryModel({ values: [undefined, EDAccountMarketType.OTC] })
          .disabledSet(() => this._isMinMarketTypeSelected && (this.fields.marketTypeList[4] as DInputBinaryModel).isChecked),
      ],
      quikTypeList: [],
      singleLimit: new DInputBinaryModel(),
      loan: new DInputBinaryModel(),
      IISOtherOwner: new DInputBinaryModel(),
    });
    makeObservable(this);
  }

  @computed
  private get _isMinMarketTypeSelected() {
    return (this.fields.marketTypeList as DInputBinaryModel<string>[]).filter(i => i.isChecked).length === 1;
  }
}
