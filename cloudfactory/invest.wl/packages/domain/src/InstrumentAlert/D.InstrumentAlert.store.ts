import { Inject, Injectable } from '@invest.wl/core';
import { reaction } from 'mobx';
import { DAuthStore } from '../Auth/D.Auth.store';
import { DAuthStoreTid } from '../Auth/D.Auth.types';
import { DInstrumentAlertGateway, DInstrumentAlertGatewayTid } from './D.InstrumentAlert.gateway';
import { DInstrumentAlertAdapterTid, IDInstrumentAlertAdapter } from './D.InstrumentAlert.types';

export const DInstrumentAlertStoreTid = Symbol.for('DInstrumentAlertStore');

@Injectable()
export class DInstrumentAlertStore {
  public countX = this._gw.count({
    name: 'DInstrumentAlertStore.countX', req: () => this.authStore.authenticated ? {} : undefined,
    interval: this._adapter.updateInterval,
  });

  constructor(
    @Inject(DInstrumentAlertGatewayTid) private _gw: DInstrumentAlertGateway,
    @Inject(DInstrumentAlertAdapterTid) private _adapter: IDInstrumentAlertAdapter,
    @Inject(DAuthStoreTid) private authStore: DAuthStore,
  ) {
    reaction(() => this.authStore.authenticated,
      (authenticated) => !authenticated && this.countX.source.clear());
  }
}
