import { delayPromise, DisposableHolder } from '@invest.wl/common';

import { EDOrderStatus, errorWhenCancelled, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction, when } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { EDErrorProgCode } from '../../Error/D.Error.types';
import { DOrderConfig, DOrderConfigTid } from '../D.Order.config';
import { DOrderGateway, DOrderGatewayTid } from '../D.Order.gateway';
import { IDOrderItemModel } from '../model/D.OrderItem.model';

export const DOrderCancelCaseTid = Symbol.for('DOrderCancelCaseTid');

export interface IDOrderCancelCaseProps {
  model: IDOrderItemModel;
}

@Injectable()
export class DOrderCancelCase {
  public static notCancelableStatus = [EDOrderStatus.Deleted, EDOrderStatus.Reduced, EDOrderStatus.Error];
  private _dh = new DisposableHolder();

  @observable.ref public props?: IDOrderCancelCaseProps;

  public infoX = this._gw.info({
    name: 'DOrderCancelCase.InfoX',
    req: () => this.isCancelling && this.props ? { id: this.props.model.id.toString() } : undefined,
    interval: this._const.cancelInterval,
  });

  @observable public isCancelling = false;

  @computed
  public get isCancelable() {
    const status = this.props?.model.status;
    return status != null ? !DOrderCancelCase.notCancelableStatus.includes(status) : false;
  }

  @computed
  public get isCanceled() {
    return this.infoX.model?.isCancelled || false;
  }

  constructor(
    @Inject(DOrderGatewayTid) private _gw: DOrderGateway,
    @Inject(DOrderConfigTid) private _const: DOrderConfig,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDOrderCancelCaseProps) {
    this.props = props;
  }

  @action
  public dispose() {
    this.props = undefined;
    this._dh.dispose();
  }

  public async cancel() {
    if (!this.props) {
      throw this._errorService.progHandle({
        fn: `${this.constructor.name}::${__FUNCTION__}`,
        code: EDErrorProgCode.NotInitialized,
      });
    }
    try {
      await this._gw.cancel({ id: this.props.model.id.toString() });
      runInAction(() => (this.isCancelling = true));
      const waiter = when(() => {
        if (this.infoX.source.error) throw this.infoX.source.error;
        return this.isCanceled;
      });
      this._dh.push(waiter.cancel);
      await Promise.race([waiter, delayPromise(this._const.cancelCheckTimeout)]);
      runInAction(() => (this.isCancelling = false));
      if (this.isCanceled) this.props.model.status = EDOrderStatus.Deleted;
    } catch (e: any) {
      // отмена ожидания не является бизнесовой ошибкой
      if (e === errorWhenCancelled) return;
      throw e;
    }
  }
}
