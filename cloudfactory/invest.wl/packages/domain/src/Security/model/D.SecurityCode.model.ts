import { IDSecurityCode, Injectable, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputCodeModel } from '../../Input/model/D.InputCode.model';

export const DSecurityCodeModelTid = Symbol.for('DSecurityCodeModelTid');
type TDTO = Typify<IDSecurityCode>;

export interface IDSecurityCodeModelProps {
  length: number;
}

export interface IDSecurityCodeModel extends IDInputFormModel<TDTO> {
}

@Injectable()
export class DSecurityCodeModel extends DInputFormModel<TDTO> implements IDSecurityCodeModel {
  constructor(props: IDSecurityCodeModelProps) {
    super({
      code: new DInputCodeModel({ length: props.length, validatorList: [DInputValidator.required] }),
    });
  }
}
