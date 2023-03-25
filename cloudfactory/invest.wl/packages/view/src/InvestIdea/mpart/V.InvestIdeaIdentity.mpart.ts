import { DModelXValue, IDModelXValue, ILambda } from '@invest.wl/common';
import { IDInvestIdeaIdentityPart } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';

type TDTO = IDInvestIdeaIdentityPart;

export interface IVInvestIdeaIdentityMpart extends IDModelXValue<TDTO> {
  readonly title: any;
  readonly type: any;
  readonly imageSrc: string;
}

export class VInvestIdeaIdentityMpart<DTO extends TDTO = TDTO> extends DModelXValue<DTO> implements IVInvestIdeaIdentityMpart {
  @computed
  public get title() {
    return this.dto.Title;
  }

  @computed
  public get type() {
    return this.dto.IdeaType;
  }

  @computed
  public get imageSrc() {
    return this.dto.Image.Big;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
