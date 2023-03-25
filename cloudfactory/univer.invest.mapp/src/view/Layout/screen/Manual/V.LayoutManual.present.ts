import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { IVLayoutManualItem } from './V.LayoutManual.types';
import { action, computed, makeObservable, observable } from 'mobx';
import { DStorageLocalStore, DStorageLocalStoreTid } from '@invest.wl/domain/src/StorageLocal/D.StorageLocal.store';
import { EDStorageLocalKey } from '@invest.wl/core/src/dto/StorageLocal';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';

export const VLayoutManualPresentTid = Symbol.for('VLayoutManualPresentTid');

@Injectable()
export class VLayoutManualPresent {
  @observable public activeIndex = 0;
  @observable public list: IVLayoutManualItem[] = [{
    title: 'Надёжный\nброкер',
    message: 'Более 25 лет\nна фондовом рынке',
  }, {
    title: 'Зарабатывайте на\nбиржевых\nинструментах',
    message: 'Доступ к торгам на площадках\nМосковской и СПБ биржи',
  }, {
    title: 'Формируем\nуникальные идеи',
    message: 'Для принятия оперативных\nинвестиционных решений',
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
