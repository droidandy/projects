import { Injectable, TModelId } from '@invest.wl/core';
import { IDInputCodeModel, IDOrderCreateConfirmModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { VInputCodeModel } from '../../Input/model/V.InputCode.model';
import { VInputIdModel } from '../../Input/model/V.InputId.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VOrderCreateConfirmModelTid = Symbol.for('VOrderCreateConfirmModelTid');

export interface IVOrderCreateConfirmModel extends IVInputFormModel<IDOrderCreateConfirmModel> {
  readonly humanId: string;
}

@Injectable()
export class VOrderCreateConfirmModel extends VInputFormModel<IDOrderCreateConfirmModel> implements IVOrderCreateConfirmModel {
  @computed
  public get humanId() {
    return `Заявка №${this.fields.orderRequestId.value}`;
  }

  public fields = {
    code: new VInputCodeModel(this.domain.fields.code as IDInputCodeModel),
    orderRequestId: new VInputIdModel(this.domain.fields.orderRequestId, { valueSetSkip: true }),
    agreementId: new VInputIdModel<TModelId | undefined>(this.domain.fields.agreementId),
  };

  constructor(domain: IDOrderCreateConfirmModel) {
    super(domain);
    makeObservable(this);
  }
}
