import { ILambda, LambdaX } from '@invest.wl/common';
import { EDCustomerAddressType, IDAddressDTO, IDCustomerAddressDTO, Injectable, IoC, Newable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { DAddressEditModel, DAddressEditModelTid, IDAddressEditModel } from '../../Address/model/D.AddressEdit.model';
import { IDInputFormModel } from '../../Input/D.Input.types';
import { DInputBinaryModel, IDInputBinaryModel } from '../../Input/model/D.InputBinary.model';

export const DCustomerAddressEditModelTid = Symbol.for('DCustomerAddressEditModelTid');

export interface IDCustomerAddressEditModel extends Omit<IDInputFormModel<IDCustomerAddressDTO>, 'fields'> {
  readonly isActualSame: IDInputBinaryModel<boolean>;
  readonly isPostalSame: IDInputBinaryModel<boolean>;
  readonly fields: { [T in EDCustomerAddressType]: IDAddressEditModel; };
}

type TFields = keyof typeof EDCustomerAddressType | keyof IDAddressDTO;

export interface IDCustomerAddressEditModelProps {
  required?: ILambda<TFields[] | undefined>;
}

@Injectable()
export class DCustomerAddressEditModel implements IDCustomerAddressEditModel {
  private _addressModel = IoC.get<Newable<typeof DAddressEditModel>>(DAddressEditModelTid);

  @computed
  private get _required() {
    return LambdaX.resolve(this._props.required) || [];
  }

  public isActualSame = new DInputBinaryModel<boolean>();
  public isPostalSame = new DInputBinaryModel<boolean>();

  public fields = {
    Register: new this._addressModel({ required: this._props.required as (keyof IDAddressDTO)[] }),
    Actual: new this._addressModel({ required: this._props.required as (keyof IDAddressDTO)[] }),
    Postal: new this._addressModel({ required: this._props.required as (keyof IDAddressDTO)[] }),
    Birth: new this._addressModel({ required: this._props.required as (keyof IDAddressDTO)[] }),
  };

  @computed
  public get isValid() {
    return this.fields.Register.isValid
    && (this.isActualSame.value || !this._required.includes('Actual') ? true : this.fields.Actual.isValid)
    && (this.isPostalSame.value || !this._required.includes('Postal') ? true : this.fields.Postal.isValid)
    && !this._required.includes('Birth') ? true : this.fields.Birth.isValid;
  }

  @computed
  public get asDTO(): IDCustomerAddressDTO {
    return {
      Register: this.fields.Register.asDTO,
      Birth: this.fields.Birth.asDTO,
      Actual: this.fields[this.isActualSame.value ? 'Register' : 'Actual'].asDTO,
      Postal: this.fields[this.isPostalSame.value ? 'Register' : 'Postal'].asDTO,
    };
  }


  public fromDTO(dto: IDCustomerAddressDTO) {
    this.fields.Register.fromDTO(dto.Register);
    this.fields.Actual.fromDTO(dto.Actual);
    this.fields.Postal.fromDTO(dto.Postal);
    this.fields.Birth.fromDTO(dto.Birth);
    return this as any;
  }

  public clear() {
    this.fields.Register.clear();
    this.fields.Actual.clear();
    this.fields.Postal.clear();
    this.fields.Birth.clear();
  }

  constructor(private _props: IDCustomerAddressEditModelProps) {
    makeObservable(this);
  }
}
