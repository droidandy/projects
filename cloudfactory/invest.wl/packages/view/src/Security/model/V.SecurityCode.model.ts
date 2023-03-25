import { Injectable } from '@invest.wl/core';
import { DSecurityCodeModel, IDInputCodeModel, IDSecurityCodeModel } from '@invest.wl/domain';
import { makeObservable } from 'mobx';
import { VInputCodeModel } from '../../Input/model/V.InputCode.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VSecurityCodeModelTid = Symbol.for('VSecurityCodeModelTid');

export interface IVSecurityCodeModel extends IVInputFormModel<IDSecurityCodeModel> {
}

@Injectable()
export class VSecurityCodeModel extends VInputFormModel<IDSecurityCodeModel> implements IVSecurityCodeModel {
  public fields = {
    code: new VInputCodeModel(this.domain.fields.code as IDInputCodeModel),
  };

  constructor(domain: DSecurityCodeModel) {
    super(domain);
    makeObservable(this);
  }
}
