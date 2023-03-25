import { IDSortResult, IObjectItem, TObject } from '@invest.wl/core';
import { action, computed, makeObservable, reaction } from 'mobx';
import { DisposableHolder } from '../../../../util/disposable.util';
import { DModelX } from '../../../ModelX/D.ModelX.model';
import { DSortXConfig } from '../D.SortX.config';
import { IDSortXConfigItemMap, IDSortXConfigMap, IDSortXMap, IDSortXModel, IDSortXProps } from '../D.SortX.types';
import { DSortXConfigModel } from './D.SortXConfig.model';

export class DSortX<I extends TObject> extends DModelX.Value<IDSortXMap<I>> {
  public config: IDSortXConfigMap<I>;
  public props?: IDSortXProps;
  private _dH: DisposableHolder;

  @computed
  public get list(): IObjectItem<IDSortXModel<I[keyof I]>, keyof I>[] {
    return Object.keys(this.dto).map((key) => ({ key, value: this.dto[key] }));
  }

  @computed
  public get isEmpty() {
    return !this.activeList.length;
  }

  @computed
  public get activeList() {
    return this.list.filter(s => !s.value.isEmpty);
  }

  @computed
  public get activeSingle() {
    return this.activeList[0];
  }

  @computed
  public get resultList() {
    return this.activeList.map(s => ({ field: s.key, direction: s.value.dto! } as IDSortResult<I>));
  }

  @computed
  public get resultSingle() {
    return this.resultList[0];
  }

  constructor(config: IDSortXConfigItemMap<I>, props?: IDSortXProps) {
    const keys = Object.keys(config);
    const fConfig = keys.reduce((acc, key: keyof I) => {
      acc[key] = new DSortXConfigModel(config[key]);
      return acc;
    }, {} as IDSortXConfigMap<I>);
    super(keys.reduce((acc, key: keyof I) => {
      const cfg = fConfig[key];
      const Model = DSortXConfig.type2model(cfg.type);
      acc[key] = new Model(undefined, cfg);
      return acc;
    }, {} as IDSortXMap<I>));
    makeObservable(this);
    this.config = fConfig;
    this._dH = new DisposableHolder();
    this.props = props;
    if (this.props?.single) {
      keys.forEach(key => this._dH.push(
        reaction(() => this.dto[key].dto, (value) => {
          if (value == null) return;
          const i = this.dto[key];
          this.list.forEach(item => i !== item.value && item.value.lvSet(undefined));
        })),
      );
    }
  }

  public dispose() {
    return this._dH.dispose();
  }

  @action.bound
  public clear() {
    this.list.forEach(s => s.value.clear());
    return this;
  }

  public sortFn(a: I, b: I) {
    return this.list.reduce((acc, { key, value }) =>
      acc + value.sort(a[key], b[key]), 0);
  }
}
