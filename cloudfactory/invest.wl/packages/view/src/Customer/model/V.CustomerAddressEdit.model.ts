import { EDCustomerAddressType, IDCustomerAddressDTO, Injectable, IoC, Newable } from '@invest.wl/core';
import { IDCustomerAddressEditModel } from '@invest.wl/domain';
import { action, computed, makeObservable } from 'mobx';
import { IVAddressEditModel, VAddressEditModel, VAddressEditModelTid } from '../../Address/model/V.AddressEdit.model';
import { VInputBinaryModel } from '../../Input/model/V.InputBinary.model';
import { IVInputFormModel } from '../../Input/V.Input.types';

export const VCustomerAddressEditModelTid = Symbol.for('VCustomerAddressEditModelTid');

export interface IVCustomerAddressEditModel extends Omit<IVInputFormModel<Omit<IDCustomerAddressEditModel, 'fields'>
& { fields: any }, IDCustomerAddressDTO>, 'fields'> {
  fields: { [T in EDCustomerAddressType]: IVAddressEditModel; };
  isActualSame: VInputBinaryModel<boolean>;
  isPostalSame: VInputBinaryModel<boolean>;
}

@Injectable()
export class VCustomerAddressEditModel implements IVCustomerAddressEditModel {
  private _addressModel = IoC.get<Newable<typeof VAddressEditModel>>(VAddressEditModelTid);

  public isActualSame = new VInputBinaryModel(this.domain.isActualSame);
  public isPostalSame = new VInputBinaryModel(this.domain.isPostalSame);

  public fields = {
    [EDCustomerAddressType.Register]: new this._addressModel(this.domain.fields.Register),
    [EDCustomerAddressType.Actual]: new this._addressModel(this.domain.fields.Actual),
    [EDCustomerAddressType.Postal]: new this._addressModel(this.domain.fields.Postal),
    [EDCustomerAddressType.Birth]: new this._addressModel(this.domain.fields.Birth),
  };

  @computed
  public get isValid() {
    return this.domain.isValid;
  }

  @action
  public reset() {
    this.fields[EDCustomerAddressType.Register].reset();
    this.fields[EDCustomerAddressType.Actual].reset();
    this.fields[EDCustomerAddressType.Postal].reset();
    this.fields[EDCustomerAddressType.Birth].reset();
  }

  @action
  public dirtySet(dirty = true) {
    this.fields[EDCustomerAddressType.Register].dirtySet(dirty);
    this.fields[EDCustomerAddressType.Actual].dirtySet(dirty);
    this.fields[EDCustomerAddressType.Postal].dirtySet(dirty);
    this.fields[EDCustomerAddressType.Birth].dirtySet(dirty);
  }

  constructor(public domain: IDCustomerAddressEditModel) {
    makeObservable(this);
  }
}
