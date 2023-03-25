import { DModelXValue, IDModelXValue, ILambda } from '@invest.wl/common';
import { IDInstrumentIdentityPart } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';

type TDTO = IDInstrumentIdentityPart;

export interface IVInstrumentIdentityMpart extends IDModelXValue<TDTO> {
  readonly name: any;
  readonly classCode: any;
  readonly secureCode: any;
  readonly imageSrc: string;
}

export class VInstrumentIdentityMpart<DTO extends TDTO = TDTO> extends DModelXValue<DTO> implements IVInstrumentIdentityMpart {
  @computed
  public get name() {
    return this.dto.Name;
  }

  @computed
  public get classCode() {
    return this.dto.ClassCode;
  }

  @computed
  public get secureCode() {
    return this.dto.SecureCode;
  }

  @computed
  public get imageSrc() {
    return this.dto.Image.Default;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
