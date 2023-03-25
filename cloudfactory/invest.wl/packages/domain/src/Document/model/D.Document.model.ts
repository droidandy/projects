import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import { EDDocumentStatus, IDDocumentDTO, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';

export const DDocumentModelTid = Symbol.for('DDocumentModelTid');

type TDTO = IDDocumentDTO;

export interface IDDocumentModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly isNew: boolean;
  readonly isProcessed: boolean;
  readonly isSigned: boolean;
}

@Injectable()
export class DDocumentModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDDocumentModel<DTO> {
  @computed
  public get isNew() {
    return this.dto.status === EDDocumentStatus.New;
  }

  @computed
  public get isProcessed() {
    return this.dto.status === EDDocumentStatus.Processed;
  }

  @computed
  public get isSigned() {
    return this.dto.status === EDDocumentStatus.Signed;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
