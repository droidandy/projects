import { EDSortDirection } from '@invest.wl/core';
import { EDSortXType } from '../D.SortX.types';
import { DSortXModel } from './D.SortX.model';

export class DSortXBooleanModel extends DSortXModel<boolean> {
  public readonly type = EDSortXType.Boolean;

  public sort(a: boolean, b: boolean) {
    if (this.isEmpty) return 0;
    switch (this.dto) {
      case EDSortDirection.Asc:
        return a === true ? 1 : -1;
      case EDSortDirection.Desc:
        return a === false ? 1 : -1;
      default:
        throw new Error(`[SortBoolean] unknown direction: ${this.dto}`);
    }
  }

  public clone() {
    return new DSortXBooleanModel(this._dtoLV, this.config);
  }
}
