import { Inject, Injectable } from '@invest.wl/core';
import {
  DInstrumentFavoriteCase,
  DInstrumentFavoriteCaseTid,
  DNotificationStoreTid,
  IDInstrumentFavoriteCaseProps,
  IDNotificationStore,
} from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';

export const VInstrumentFavoritePresentTid = Symbol.for('VInstrumentFavoritePresentTid');

export interface IVInstrumentFavoritePresentProps extends IDInstrumentFavoriteCaseProps {
}

@Injectable()
export class VInstrumentFavoritePresent {
  @observable public props?: IVInstrumentFavoritePresentProps;

  constructor(
    @Inject(DInstrumentFavoriteCaseTid) public cse: DInstrumentFavoriteCase,
    @Inject(DNotificationStoreTid) private _notification: IDNotificationStore,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVInstrumentFavoritePresentProps) {
    this.cse.init(props);
  }

  public toggle = async () => {
    await this.cse.toggle();
    this._notification.successAdd(`Инструмент ${this.cse.model?.isFavorite ? 'добавлен в Избранное' : 'удалён из Избранного'}`);
  };
}

