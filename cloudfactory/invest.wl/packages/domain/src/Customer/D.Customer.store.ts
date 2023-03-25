import { MapX } from '@invest.wl/common';
import { EDStorageLocalKey, IDCustomerPreferenceSetRequestDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { computed, observable, reaction, runInAction } from 'mobx';
import { DAuthStore } from '../Auth/D.Auth.store';
import { DAuthStoreTid } from '../Auth/D.Auth.types';
import { DSecurityStore } from '../Security/D.Security.store';
import { DSecurityStoreTid } from '../Security/D.Security.types';
import { DStorageLocalStore, DStorageLocalStoreTid } from '../StorageLocal/D.StorageLocal.store';
import { DCustomerGateway } from './D.Customer.gateway';
import { DCustomerGatewayTid } from './D.Customer.types';
import { DCustomerPreferenceMapModel, DCustomerPreferenceMapModelTid } from './model/D.CustomerPreferenceMap.model';

@Injectable()
export class DCustomerStore {
  public accountSelfX = this._gw.accountSelf({
    name: 'DCustomerStore.SelfX', req: () => this._authStore.authenticated ? {} : undefined,
    onLoaded: (req, res) => {
      if (res?.data.Name) this._slStore.set(EDStorageLocalKey.CustomerName, res.data.Name);
    },
  });

  @observable private _name?: string;
  @computed
  public get name() {
    return this.accountSelfX.model?.dto.Name ?? this._name;
  }

  public preferenceMapX = new MapX.D(
    this.accountSelfX.source,
    () => this.accountSelfX.model?.dto.Preferences,
    lv => new this._preferenceMapModel(lv),
  );

  constructor(
    @Inject(DCustomerGatewayTid) private _gw: DCustomerGateway,
    @Inject(DCustomerPreferenceMapModelTid) private _preferenceMapModel: Newable<typeof DCustomerPreferenceMapModel>,
    @Inject(DAuthStoreTid) private _authStore: DAuthStore,
    @Inject(DSecurityStoreTid) private _securityStore: DSecurityStore,
    @Inject(DStorageLocalStoreTid) private _slStore: DStorageLocalStore,
  ) {
    this._name = this._slStore.get(EDStorageLocalKey.CustomerName);
    this.accountSelfX.source.refresh().then();
    reaction(() => this._authStore.authenticated, (authenticated) =>
      authenticated ? this.accountSelfX.source.refresh() : this.accountSelfX.source.clear());
    reaction(() => this._securityStore.unlockCan, (unlockCan) => {
      if (!unlockCan) runInAction(() => (this._name = undefined));
    });
  }

  public async preferenceSet(req: IDCustomerPreferenceSetRequestDTO) {
    const res = await this._gw.preferenceSet(req);
    await this.accountSelfX.source.refresh();
    return res;
  }
}
