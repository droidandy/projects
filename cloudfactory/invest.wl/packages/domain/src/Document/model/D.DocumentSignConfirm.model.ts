import { IDDocumentSignConfirmRequestDTO, Typify } from '@invest.wl/core';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputFormModel } from '../../Input/D.InputForm.model';
import { DInputCodeModel } from '../../Input/model/D.InputCode.model';

export const DDocumentSignConfirmModelTid = Symbol.for('DDocumentSignConfirmModelTid');
type TDTO = Typify<IDDocumentSignConfirmRequestDTO>;

export interface IDDocumentSignConfirmModelProps {
  codeLength: number;
}

export interface IDDocumentSignConfirmModel extends IDInputFormModel<TDTO> {
}

export class DDocumentSignConfirmModel extends DInputFormModel<TDTO> implements IDDocumentSignConfirmModel {
  constructor(public props: IDDocumentSignConfirmModelProps) {
    super({
      code: new DInputCodeModel({ length: props.codeLength, validatorList: [DInputValidator.required] }),
    });
  }
}
