import { delayPromise, DisposableHolder, MapX } from '@invest.wl/common';

import {
  EDAccountBoard,
  EDOrderStatus,
  EDTradeDirection,
  errorWhenCancelled,
  IDInstrumentId,
  IDOrderRequestCreateRequestDTO,
  Inject,
  Injectable,
  Newable,
} from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction, when } from 'mobx';
import { DAccountGateway, DAccountGatewayTid } from '../../Account/D.Account.gateway';
import { DAccountStore, DAccountStoreTid } from '../../Account/D.Account.store';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { EDErrorBusinessCode } from '../../Error/D.Error.types';
import { DInstrumentGateway, DInstrumentGatewayTid } from '../../Instrument/D.Instrument.gateway';
import { DOrderConfig, DOrderConfigTid } from '../D.Order.config';
import { DOrderGateway, DOrderGatewayTid } from '../D.Order.gateway';
import { DOrderCreateConfirmStrategyTid, IDOrderCreateConfirmStrategy } from '../D.Order.types';
import { DOrderCreateModel, DOrderCreateModelTid } from '../model/D.OrderCreate.model';
import { DOrderCreateConfirmModel, DOrderCreateConfirmModelTid } from '../model/D.OrderCreateConfirm.model';

export const DOrderCreateCaseTid = Symbol.for('DOrderCreateCaseTid');

export interface IDOrderCreateCaseProps {
  cid: IDInstrumentId;
  direction: EDTradeDirection;
  dto?: IDOrderRequestCreateRequestDTO;
}

@Injectable()
export class DOrderCreateCase {
  public static statusSuccess = [EDOrderStatus.New, EDOrderStatus.Reduced, EDOrderStatus.ReducedPartial];
  public static statusNotFailed = [EDOrderStatus.NotSent, ...DOrderCreateCase.statusSuccess];
  public static accountBoardNotMargin = [EDAccountBoard.Term, EDAccountBoard.OTC];

  @observable.ref public props?: IDOrderCreateCaseProps;
  @observable public isBusy = false;
  @observable public isConfirming = false;

  private _isCancelled = false;
  private _dh = new DisposableHolder();

  public createModel = new this._createModel({
    instrument: () => this.instrumentX.model, accountList: () => this.accountListX.list,
  });
  public confirmModel = new this._createConfirmModel({
    codeLength: this._const.createCodeLength,
  });

  public instrumentX = this._instrumentGw.info({
    name: 'DOrderCreateCase.instrumentX', req: () => this.props ? this.props.cid.toJSON() : undefined,
    interval: 3000,
  });

  private _accountListX = this._accountGw.QUIKList({
    name: 'DOrderCreateCase.accountListX', req: () => this.props ? this.props.cid.toJSON(true) : undefined,
    onLoaded: () => setTimeout(() => {
      if (this.accountListX.list.length === 1) {
        this.createModel.fields.accountId.valueSet(this.accountListX.list[0].id);
      }
    }, 300),
  });

  public accountListX = new MapX.DProxyList(
    () => {
      const ids = this._accountStore.agreementIdListSelected.length ? this._accountStore.agreementIdListSelected : undefined;
      return this._accountListX.list.filter(a => a.dto.IsTradingAccount
        && (ids ? ids.includes(a.dto.Agreement.id) : true));
    },
    this._accountListX.source,
  );

  public infoX = this._gw.info({
    name: 'DOrderCreateCase.InfoX', interval: this._const.createCheckInterval,
    req: () => this.isConfirming && this.createModel.fields.id.value
      ? { id: this.createModel.fields.id.value } : undefined,
  });

  @computed
  public get accountSelected() {
    return this.accountListX.list.find(a => this.createModel.fields.accountId.value === a.id);
  }

  @computed
  public get isBuy() {
    return this.props?.direction === EDTradeDirection.Buy;
  }

  @computed
  public get isSell() {
    return this.props?.direction === EDTradeDirection.Sell;
  }

  @computed
  public get isMargin() {
    if (!this.accountSelected || DOrderCreateCase.accountBoardNotMargin.includes(this.accountSelected.dto.Board)) {
      return false;
    }
    return this.isBuy
      ? (this.createModel.cost > this.accountSelected.dto.FreeCashInstrumentCurrency)
      : ((this.createModel.fields.amount.value || 0) > this.accountSelected.dto.FreeInstrumentAmount);
  }

  constructor(
    @Inject(DOrderCreateConfirmStrategyTid) public strategy: IDOrderCreateConfirmStrategy,
    @Inject(DOrderConfigTid) private _const: DOrderConfig,
    @Inject(DOrderGatewayTid) private _gw: DOrderGateway,
    @Inject(DOrderCreateModelTid) private _createModel: Newable<typeof DOrderCreateModel>,
    @Inject(DOrderCreateConfirmModelTid) private _createConfirmModel: Newable<typeof DOrderCreateConfirmModel>,
    @Inject(DAccountStoreTid) private _accountStore: DAccountStore,
    @Inject(DAccountGatewayTid) private _accountGw: DAccountGateway,
    @Inject(DInstrumentGatewayTid) private _instrumentGw: DInstrumentGateway,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDOrderCreateCaseProps) {
    this.props = props;
    // Проставляем временный ID, чтобы была валидация
    // при любой попытке создать заявку он всёравно будет обновляться orderIdNew
    if (props.dto) {
      this.createModel.fromDTO(props.dto);
    }
    this.createModel.fields.id.valueSet('-1');
    this.createModel.fields.bs.valueSet(props.direction);
    this.createModel.fields.instrument.id.valueSet(props.cid.id);
    this.createModel.fields.instrument.classCode.valueSet(props.cid.classCode);
    this.createModel.fields.instrument.secureCode.valueSet(props.cid.secureCode);
    this.createModel.fields.tradeAccountMapId.valueSet(() => this.accountSelected?.dto.TradeAccountMapId);
  }

  public dispose() {
    this._dh.dispose();
  }

  @action
  public async create() {
    if (!this.createModel.isValid) {
      throw this._errorService.businessHandle({
        fn: `${this.constructor.name}::${__FUNCTION__}`,
        code: EDErrorBusinessCode.FormNotValid,
      });
    }
    try {
      this.isBusy = true;
      const resId = await this._gw.idCreate({});
      this.createModel.fields.id.valueSet(resId.data.id);
      if (this._isCancelled) {
        return;
      }

      const res = await this._gw.requestCreate(this.createModel.asDTO);
      this.confirmModel.fields.orderRequestId.valueSet(res.data.OrderRequestId);
      if (this._isCancelled) {
        return;
      }
      await this.strategy.onCreate(this.createModel);
    } finally {
      runInAction(() => (this.isBusy = false));
    }
  }

  public async confirm() {
    await this.strategy.onConfirm(this.confirmModel);
    try {
      await this._gw.requestConfirm(this.confirmModel.asDTO);
      runInAction(() => (this.isConfirming = true));
      const waiter = when(() => {
        if (this._isCancelled) {
          throw this._errorService.businessHandle({
            fn: `${this.constructor.name}::${__FUNCTION__}`,
            code: EDErrorBusinessCode.OrderCreateCanceled,
          });
        }
        const status = this.infoX.model?.status;
        return !(!status || status === EDOrderStatus.NotSent);
      });
      this._dh.push(waiter.cancel);
      await Promise.race([waiter, delayPromise(this._const.createCheckTimeout)]);
      if (!DOrderCreateCase.statusNotFailed.includes(this.infoX.model?.status!)) {
        throw this._errorService.businessHandle({
          fn: `${this.constructor.name}::${__FUNCTION__}`,
          code: EDErrorBusinessCode.OrderCreateConfirmFailed,
          message: this.infoX.model?.dto.Error,
        });
      }
    } catch (e: any) {
      // отмена ожидания не является бизнесовой ошибкой
      if (e === errorWhenCancelled) {
        return;
      }
      throw e;
    } finally {
      runInAction(() => (this.isConfirming = false));
    }
  }

  public cancel() {
    // TODO: add support cancelable promise and refact this
    this._isCancelled = true;
    setTimeout(() => (this._isCancelled = false), 1500);
  }
}
