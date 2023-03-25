import { IDCustomerPreferenceSetRequestDTO, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DAuthService } from '../../Auth/D.Auth.service';
import { DAuthServiceTid } from '../../Auth/D.Auth.types';
import { DCustomerStore } from '../D.Customer.store';
import { DCustomerStoreTid } from '../D.Customer.types';

export const DCustomerAccountSelfCaseTid = Symbol.for('DCustomerAccountSelfCaseTid');

export interface IDCustomerAccountSelfCaseProps {
}

@Injectable()
export class DCustomerAccountSelfCase {
  @observable.ref public props?: IDCustomerAccountSelfCaseProps;

  @computed
  public get selfX() {
    return this._store.accountSelfX;
  }

  @computed
  public get preferenceMapX() {
    return this._store.preferenceMapX;
  }

  @computed
  public get name() {
    return this._store.name;
  }

  constructor(
    @Inject(DCustomerStoreTid) private _store: DCustomerStore,
    @Inject(DAuthServiceTid) private _authService: DAuthService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDCustomerAccountSelfCaseProps) {
    this.props = props;
  }

  public preferenceSet(req: IDCustomerPreferenceSetRequestDTO) {
    return this._store.preferenceSet(req);
  }

  public signOut = () => this._authService.signOut();
}
