import { Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DApplicationConfig } from '../D.Application.config';
import { DApplicationStore } from '../D.Application.store';
import { DApplicationConfigTid, DApplicationStoreTid } from '../D.Application.types';

export const DApplicationVersionCaseTid = Symbol.for('DApplicationVersionCaseTid');

export interface IDApplicationVersionCaseProps {
}

@Injectable()
export class DApplicationVersionCase {
  @observable.ref public props?: IDApplicationVersionCaseProps;

  constructor(
    @Inject(DApplicationStoreTid) private _store: DApplicationStore,
    @Inject(DApplicationConfigTid) private _cfg: DApplicationConfig,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDApplicationVersionCaseProps) {
    this.props = props;
  }

  @computed
  public get needUpdate() {
    return this._store.needUpdate;
  }

  @computed
  public get info() {
    return this._cfg.versionInfo;
  }

  @computed
  public get build() {
    return this._cfg.versionBuild;
  }

  @computed
  public get buildRevision() {
    return this._cfg.versionBuildRevision;
  }

  @computed
  public get buildDate() {
    return this._cfg.buildDate;
  }

  @computed
  public get adviser() {
    return this._cfg.versionAdviser;
  }

  @computed
  public get isNewVersion() {
    return this._store.isNewVersion;
  }
}
