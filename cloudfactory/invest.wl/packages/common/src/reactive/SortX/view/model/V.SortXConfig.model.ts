import { TObject } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { IDSortXConfigModel } from '../../domain/D.SortX.types';
import { VSortXI18n } from '../V.SortX.i18n';
import { IVSortXConfigItem, IVSortXConfigModel } from '../V.SortX.types';

export class VSortXConfigModel<I extends TObject, K extends keyof I>
implements IVSortXConfigModel<I[K]> {
  public title?: string;
  public hidden?: boolean;

  @computed
  public get list() {
    return this.domain.list.map(d => ({ name: VSortXI18n.direction[d], value: d }));
  }

  constructor(public domain: IDSortXConfigModel<I[K]>, data: IVSortXConfigItem) {
    makeObservable(this);
    this.title = data.title;
    this.hidden = data.hidden;
  }
}
