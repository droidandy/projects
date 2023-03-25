import { EDStorageLocalKey, Inject, Injectable } from '@invest.wl/core';
import { DStorageLocalStore, DStorageLocalStoreTid } from '@invest.wl/domain/src/StorageLocal/D.StorageLocal.store';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { action, computed, makeObservable, observable } from 'mobx';
import { IVLayoutManualItem } from './V.LayoutManual.types';

export const VLayoutManualPresentTid = Symbol.for('VLayoutManualPresentTid');

@Injectable()
export class VLayoutManualPresent {
  @observable public activeIndex = 0;
  @observable public list: IVLayoutManualItem[] = [{
    title: 'Управляйте активами',
    message: 'Доступ к инвестициям 24/7.\nВезде, где есть интернет.',
    image: require('../../assets/present1.png'),
  }, {
    title: 'Пополняйте портфель',
    message: 'Покупайте новые продукты.\nНаращивайте активы.',
    image: require('../../assets/present2.png'),
  }, {
    title: 'Будьте в курсе',
    message: 'Получайте оперативную консультацию\nв чате и свежую аналитику рынка.',
    image: require('../../assets/present3.png'),
  }];

  @computed
  public get isLast() {
    return this.activeIndex === this.list.length - 1;
  }

  constructor(
    @Inject(VRouterServiceTid) private _router: IVRouterService,
    @Inject(DStorageLocalStoreTid) private _slStore: DStorageLocalStore,
  ) {
    makeObservable(this);
  }

  @action
  public activeSet = (index: number) => {
    this.activeIndex = index;
    if (this.activeIndex >= this.list.length) {
      this.activeIndex = this.list.length - 1;
      this.goMain().then();
    } else if (this.activeIndex < 0) {
      this.activeIndex = 0;
    }
  };

  public next = () => this.activeSet(this.activeIndex + 1);
  public prev = () => this.activeSet(this.activeIndex - 1);
  public goMain = async () => {
    await this._slStore.set(EDStorageLocalKey.LayoutManualSeen, 'true');
    this._router.resetTo(EVLayoutScreen.LayoutEntry);
  };
}
