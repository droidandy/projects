import { reaction } from 'mobx';
import { EDNotificationType, IDNotificationDTO, Inject, Injectable } from '@invest.wl/core';
import { SErrorModel } from '../Error/model/S.Error.model';
import { SErrorHttpModel } from '../Error/model/S.ErrorHttp.model';
import { SErrorStore } from '../Error/S.Error.store';
import { SErrorStoreTid } from '../Error/S.Error.types';
import { ISNetworkStore, SNetworkStoreTid } from '../Network';
import { ISNotificationStore, SNotificationStoreTid } from './S.Notification.types';

@Injectable()
export class SNotificationListener {
  private _errorNetwork?: IDNotificationDTO;

  constructor(
    @Inject(SNotificationStoreTid) private _store: ISNotificationStore,
    @Inject(SErrorStoreTid) private _errorStore: SErrorStore,
    @Inject(SNetworkStoreTid) private _networkStore: ISNetworkStore,
  ) { }

  public init() {
    this._errorStore.errorX.subscribe(e => {
      if (e instanceof SErrorModel && !e.isNotified) {
        e.isNotified = true;
        if (e instanceof SErrorHttpModel && e.isAccess) {
          this._store.clear();
          this._store.infoAdd(e.message);
        } else if (e instanceof SErrorHttpModel && e.isNetwork) {
          this._errorNetwork = this._store.add({ type: EDNotificationType.Error, message: e.message, closeable: false });
        } else {
          this._store.errorAdd(e.message);
        }
      }
    });
    reaction(() => this._networkStore.isNetwork, (isErrorNetwork) => {
      if (!isErrorNetwork && this._errorNetwork) {
        this._store.remove(this._errorNetwork);
        this._errorNetwork = undefined;
      }
    });
  }
}
