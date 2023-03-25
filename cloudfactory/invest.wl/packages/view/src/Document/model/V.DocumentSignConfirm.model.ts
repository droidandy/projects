import { Injectable } from '@invest.wl/core';
import { IDDocumentSignConfirmModel, IDInputCodeModel } from '@invest.wl/domain';
import { VInputCodeModel } from '../../Input/model/V.InputCode.model';
import { IVInputFormModel } from '../../Input/V.Input.types';
import { VInputFormModel } from '../../Input/V.InputForm.model';

export const VDocumentSignConfirmModelTid = Symbol.for('VDocumentSignConfirmModelTid');

export interface IVDocumentSignConfirmModel extends IVInputFormModel<IDDocumentSignConfirmModel> {
}

@Injectable()
export class VDocumentSignConfirmModel extends VInputFormModel<IDDocumentSignConfirmModel> implements IVDocumentSignConfirmModel {
  public fields = {
    code: new VInputCodeModel(this.domain.fields.code as IDInputCodeModel),
  };
}
