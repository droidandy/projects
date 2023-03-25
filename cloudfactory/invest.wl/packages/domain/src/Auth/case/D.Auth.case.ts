import { Inject, Injectable } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { DAuthService } from '../D.Auth.service';
import { DAuthStore } from '../D.Auth.store';
import { DAuthServiceTid, DAuthStoreTid } from '../D.Auth.types';

export const DAuthCaseTid = Symbol.for('DAuthCase');

@Injectable()
export class DAuthCase {
  constructor(
    @Inject(DAuthStoreTid) private _store: DAuthStore,
    @Inject(DAuthServiceTid) private _service: DAuthService,
  ) {
    makeObservable(this);
  }

  @computed
  public get authenticated() {
    return this._store.authenticated;
  }

  public signOut = () => this._service.signOut();
}
