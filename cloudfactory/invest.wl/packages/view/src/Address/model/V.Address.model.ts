import { ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDAddressModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';

export const VAddressModelTid = Symbol.for('VAddressModelTid');

export interface IVAddressModel extends IVModelX<IDAddressModel> {
  readonly full: string;
  readonly country: string;
  readonly city: string;
  readonly street?: string;
  readonly house?: string;
  readonly block?: string;
  readonly flat?: string;
}

@Injectable()
export class VAddressModel extends VModelX<IDAddressModel> implements IVAddressModel {
  @computed
  public get full() {
    return this.domain.dto.full || `${this.country} ${this.street} ${this.house || ''} ${this.flat || ''}`;
  }

  @computed
  public get country() {
    return this.domain.dto.country;
  }

  @computed
  public get city() {
    return this.domain.dto.city;
  }

  @computed
  public get street() {
    return this.domain.dto.street;
  }

  @computed
  public get house() {
    return this.domain.dto.house;
  }

  @computed
  public get block() {
    return this.domain.dto.block;
  }

  @computed
  public get flat() {
    return this.domain.dto.flat;
  }

  constructor(dtoLV: ILambda<IDAddressModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
