import { EDFilterXType, TDFilterXArrayOperator } from '../D.FilterX.types';
import { DFilterXModel } from './D.FilterX.model';

export class DFilterXArrayModel<T extends string | number | Date> extends DFilterXModel<T, TDFilterXArrayOperator> {
  public readonly type = EDFilterXType.Array;

  public filter(value: T) {
    if (this.isEmpty || !Array.isArray(this.dto)) return true;
    switch (this.operator) {
      case 'include':
        return this.dto!.includes(value);
      case 'exclude':
        return !this.dto!.includes(value);
      default:
        throw new Error(`[FilterArray] unknown operator: ${this.operator}`);
    }
  }

  public clone() {
    return new DFilterXArrayModel(this._dtoLV, this.operator, this.config);
  }
}
