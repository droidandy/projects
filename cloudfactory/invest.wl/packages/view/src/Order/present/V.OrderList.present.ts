import { MapX, VFilterX, VModalModel } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import {
  DNotificationStore,
  DNotificationStoreTid,
  DOrderCancelCase,
  DOrderCancelCaseTid,
  DOrderListCase,
  DOrderListCaseTid,
  IDOrderListCaseProps,
} from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { IVRouterService, VRouterServiceTid } from '../../Router/V.Router.types';
import { IVOrderItemModel, VOrderItemModel, VOrderItemModelTid } from '../model/V.OrderItem.model';
import { EVOrderScreen } from '../V.Order.types';

export const VOrderListPresentTid = Symbol.for('VOrderListPresentTid');

export interface IVOrderListPresentProps extends IDOrderListCaseProps {
}

@Injectable()
export class VOrderListPresent {
  @observable.ref public props?: IVOrderListPresentProps;
  public modalCancel = new VModalModel();

  public listX = new MapX.VList(this.listCase.listX.source,
    () => this.listCase.listX.list, (m) => new this.modelItem(m));

  public cancelX = new MapX.V(this.listCase.listX.source,
    () => this.listCase.listX.list.find(o => o.id === this.cancelCase.props?.model.id),
    (m) => new this.modelItem(m));

  public filterX = new VFilterX(this.listCase.filterX, {
    InstrumentName: { title: 'Имя инструмента', hidden: true },
    Date: { title: 'Дата', separate: true, hidden: true },
    AccountId: { title: 'Счет', separate: true },
    Status: { title: 'Статус заявки', separate: true },
    BS: {},
  });

  constructor(
    @Inject(DOrderListCaseTid) public listCase: DOrderListCase,
    @Inject(DOrderCancelCaseTid) public cancelCase: DOrderCancelCase,
    @Inject(DNotificationStoreTid) private _notificationStore: DNotificationStore,
    @Inject(VRouterServiceTid) private _router: IVRouterService,
    @Inject(VOrderItemModelTid) private modelItem: Newable<typeof VOrderItemModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVOrderListPresentProps) {
    this.props = props;
    this.listCase.init(props);
  }

  public dispose() {
    this.cancelCase.dispose();
  }

  public cancelInit = (model: IVOrderItemModel) => {
    this.cancelCase.init({ model: model.domain });
    this.modalCancel.open();
  };

  public cancelDismiss = async () => {
    this.modalCancel.close();
    await this.modalCancel.whenClose();
    this.cancelCase.dispose();
  };

  public cancel = async () => {
    await this.cancelCase.cancel();
    const isCanceled = this.cancelCase.isCanceled;
    await this.cancelDismiss();
    if (isCanceled) this._notificationStore.successAdd('Заявка успешно удалена');
    else this._notificationStore.errorAdd('Отмена заявки за установленное время не выполнена. Попробуйте позже или обратитесь в поддержку');
  };

  public replace = async (model: IVOrderItemModel) => {
    this.cancelCase.init({ model: model.domain });
    await this.cancelCase.cancel();
    this.cancelCase.dispose();
    this.repeat(model);
  };

  public repeat = (model: IVOrderItemModel) => {
    this._router.navigateTo(EVOrderScreen.OrderCreate, {
      direction: model.domain.dto.BS, cid: model.domain.dto.Instrument.id,
      dto: model.domain.asOrderCreateDTO,
    });
  };
}
