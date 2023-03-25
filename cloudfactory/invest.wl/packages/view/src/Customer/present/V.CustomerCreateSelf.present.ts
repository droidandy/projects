import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DCustomerCreateSelfCase, DCustomerCreateSelfCaseTid, IDCustomerCreateSelfCaseProps } from '@invest.wl/domain';
import { VInputBinaryModel } from '../../Input/model/V.InputBinary.model';
import { VInputCodeModel } from '../../Input/model/V.InputCode.model';
import { VTimerBgModel } from '../../Timer/model/V.TimerBg.model';
import { VCustomerAddressEditModel, VCustomerAddressEditModelTid } from '../model/V.CustomerAddressEdit.model';
import { VCustomerContactEditModel, VCustomerContactEditModelTid } from '../model/V.CustomerContactEdit.model';
import { VCustomerPassportEditModel, VCustomerPassportEditModelTid } from '../model/V.CustomerPassportEdit.model';
import { VCustomerPersonalEditModel, VCustomerPersonalEditModelTid } from '../model/V.CustomerPersonalEdit.model';

export const VCustomerCreateSelfPresentTid = Symbol.for('VCustomerCreateSelfPresentTid');

export interface IVCustomerCreateSelfPresentProps extends IDCustomerCreateSelfCaseProps {
}

@Injectable()
export class VCustomerCreateSelfPresent {
  public personalDataHandleAgree = new VInputBinaryModel(this.cse.personalDataHandleAgree);

  public passportModel = new this._passportModel(this.cse.passportModel);
  public personalModel = new this._personalModel(this.cse.personalModel);
  public addressModel = new this._addressModel(this.cse.addressModel);
  public contactModel = new this._contactModel(this.cse.contactModel);

  public code = new VInputCodeModel(this.cse.code);
  public timer = new VTimerBgModel(this.cse.timer);

  constructor(
    @Inject(DCustomerCreateSelfCaseTid) public cse: DCustomerCreateSelfCase,
    @Inject(VCustomerPassportEditModelTid) private _passportModel: Newable<typeof VCustomerPassportEditModel>,
    @Inject(VCustomerPersonalEditModelTid) private _personalModel: Newable<typeof VCustomerPersonalEditModel>,
    @Inject(VCustomerAddressEditModelTid) private _addressModel: Newable<typeof VCustomerAddressEditModel>,
    @Inject(VCustomerContactEditModelTid) private _contactModel: Newable<typeof VCustomerContactEditModel>,
  ) { }

  public init(props: IDCustomerCreateSelfCaseProps) {
    this.cse.init(props);
  }
}
