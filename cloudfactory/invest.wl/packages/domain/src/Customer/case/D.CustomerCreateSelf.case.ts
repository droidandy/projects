import {
  IDCustomerAddressDTO,
  IDCustomerContactDTO,
  IDCustomerPassportDTO,
  IDCustomerPersonalDTO,
  Inject,
  Injectable,
  Newable,
  TDCustomerEditField,
} from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { DAuthConfig } from '../../Auth/D.Auth.config';
import { DAuthConfigTid } from '../../Auth/D.Auth.types';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { DInputValidator } from '../../Input/D.Input.validator';
import { DInputBinaryModel } from '../../Input/model/D.InputBinary.model';
import { DInputCodeModel } from '../../Input/model/D.InputCode.model';
import { EDTimerBgName } from '../../Timer/D.Timer.types';
import { DTimerBgModel } from '../../Timer/model/D.TimerBg.model';
import { DCustomerGateway } from '../D.Customer.gateway';
import { DCustomerGatewayTid } from '../D.Customer.types';
import { DCustomerAddressEditModel, DCustomerAddressEditModelTid } from '../model/D.CustomerAddressEdit.model';
import { DCustomerContactEditModel, DCustomerContactEditModelTid } from '../model/D.CustomerContactEdit.model';
import { DCustomerPassportEditModel, DCustomerPassportEditModelTid } from '../model/D.CustomerPassportEdit.model';
import { DCustomerPersonalEditModel, DCustomerPersonalEditModelTid } from '../model/D.CustomerPersonalEdit.model';

export const DCustomerCreateSelfCaseTid = Symbol.for('DCustomerCreateSelfCaseTid');

export interface IDCustomerCreateSelfCaseProps {
  required: TDCustomerEditField[];
  confirmNeed?: boolean;
}

@Injectable()
export class DCustomerCreateSelfCase {
  @observable.ref public props?: IDCustomerCreateSelfCaseProps;
  @observable public isBusy = false;
  @observable public isConfirmed = false;

  public personalDataHandleAgree = new DInputBinaryModel<boolean>({ validatorList: [DInputValidator.required] });
  public passportModel = new this._passportModel({ required: () => this.props?.required as (keyof IDCustomerPassportDTO)[] });
  public personalModel = new this._personalModel({ required: () => this.props?.required as (keyof IDCustomerPersonalDTO)[] });
  public addressModel = new this._addressModel({ required: () => this.props?.required as (keyof IDCustomerAddressDTO)[] });
  public contactModel = new this._contactModel({ required: () => this.props?.required as (keyof IDCustomerContactDTO)[] });

  @computed
  public get isValid() {
    return this.personalDataHandleAgree.isValid && this.passportModel.isValid && this.personalModel.isValid && this.addressModel.isValid && this.contactModel.isValid;
  }

  public code = new DInputCodeModel({ length: 4 });
  public timer = new DTimerBgModel({ name: EDTimerBgName.CustomerContactFormConfirm });

  constructor(
    @Inject(DCustomerPassportEditModelTid) private _passportModel: Newable<typeof DCustomerPassportEditModel>,
    @Inject(DCustomerPersonalEditModelTid) private _personalModel: Newable<typeof DCustomerPersonalEditModel>,
    @Inject(DCustomerAddressEditModelTid) private _addressModel: Newable<typeof DCustomerAddressEditModel>,
    @Inject(DCustomerContactEditModelTid) private _contactModel: Newable<typeof DCustomerContactEditModel>,
    @Inject(DCustomerGatewayTid) private _gw: DCustomerGateway,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
    @Inject(DAuthConfigTid) private _authCfg: DAuthConfig,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDCustomerCreateSelfCaseProps) {
    this.props = props;
    if (!props.confirmNeed) this.isConfirmed = true;
  }

  @action
  public async create() {
    if (!this.isValid) throw this._errorService.businessHandle('Неверно заполнены данные');
    try {
      this.isBusy = true;
      const res = await this._gw.createSelf({
        passport: this.passportModel.asDTO,
        personal: this.personalModel.asDTO,
        contact: this.contactModel.asDTO,
        address: this.addressModel.asDTO,
      });
      if (!this.props?.confirmNeed) {
        this.reset();
      } else {
        await this.timer.start(this._authCfg.smsCodeResendInterval);
      }
      return res;
    } finally {
      runInAction(() => this.isBusy = false);
    }
  }

  @action.bound
  public async codeResend() {
    if (!this.isValid) throw this._errorService.businessHandle('Неверно заполнены данные');
    try {
      this.isBusy = true;
      await this._gw.createSelfCodeResend({});
      await this.timer.start(this._authCfg.smsCodeResendInterval);
    } finally {
      runInAction(() => this.isBusy = false);
    }
  }

  @action
  public async confirm() {
    if (!this.code.isValid) throw this._errorService.businessHandle('Неверный код подтверждения');
    try {
      this.isBusy = true;
      await this._gw.createSelfConfirm({ code: this.code.value! });
      await this.timer.clear();
      this.isConfirmed = true;
      this.reset();
    } finally {
      runInAction(() => {
        this.isBusy = false;
        this.codeClean();
      });
    }
  }

  @action
  public reset() {
    this.passportModel.clear();
    this.personalModel.clear();
    this.contactModel.clear();
    this.addressModel.clear();
    this.personalDataHandleAgree.valueSet(undefined);
  }

  @action.bound
  public codeClean() {
    this.code.valueSet(undefined);
  }
}
