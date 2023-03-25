import { computed, makeObservable, observable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { DModelX } from '../../../ModelX/D.ModelX.model';
import { EDFilterXType, IDFilterXConfigModel, IDFilterXModel, TDFilterXOperator, TDFilterXOperatorMapper, TDFilterXType } from '../D.FilterX.types';

export abstract class DFilterXModel<T extends TDFilterXType, O extends TDFilterXOperator = TDFilterXOperatorMapper<T>> extends DModelX.Value<T | undefined>
  implements IDFilterXModel<T, O> {
  @observable public abstract type: EDFilterXType;
  @observable public operator?: O;
  @observable.ref public config?: IDFilterXConfigModel<T>;

  @computed
  public get isEmpty() {
    return this.dto == null || this.dto === '' || this.operator == null;
  }

  @observable private _isActive = true;
  @computed
  public get isActive() {
    return !this.isEmpty && this._isActive;
  }

  public set isActive(v: boolean) {
    this._isActive = v;
  }

  constructor(dtoLV: ILambda<T | undefined>, operator?: O, config?: IDFilterXConfigModel<T>) {
    super(dtoLV);
    this.operator = operator;
    this.config = config;
    makeObservable(this);
  }

  public abstract filter(value: T): boolean;
  public abstract clone(): IDFilterXModel<T>;

  public clear() {
    if (this.isLambda) return;
    this.lvSet(undefined);
  }
}
