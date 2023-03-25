import { EDSortDirection } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { IDSortXConfigItem, IDSortXConfigModel, TDSortXType, TDSortXTypeMapper } from '../D.SortX.types';

export class DSortXConfigModel<T extends TDSortXType> implements IDSortXConfigModel<T> {
  public type: TDSortXTypeMapper<T>;

  @computed
  public get list() {
    return [EDSortDirection.Desc, EDSortDirection.Asc, EDSortDirection.None];
  };

  constructor(config: IDSortXConfigItem<T>) {
    this.type = config.type;
    makeObservable(this);
  }
}
