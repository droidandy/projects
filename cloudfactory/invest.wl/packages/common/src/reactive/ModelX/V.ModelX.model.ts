import { action, computed, makeObservable, observable } from 'mobx';
import { ILambda, lambdaResolve } from '../LambdaX';
import { IDModelX, IDModelXValue, IVModelX, IVModelXValue } from './ModelX.types';

export abstract class VModelXValue<V extends IDModelXValue<any>> implements IVModelXValue<V> {
  @observable.ref public _domain: ILambda<V>;

  @computed
  public get domain() {
    return lambdaResolve(this._domain);
  }

  constructor(domain: ILambda<V>) {
    makeObservable(this);
    this._domain = domain;
  }

  // @deprecated - использовать lvSet()
  public domainSet(domain: ILambda<V>) {
    this.lvSet(domain);
  }

  @action
  public lvSet(domain: ILambda<V>) {
    this._domain = domain;
  }
}

export abstract class VModelX<M extends IDModelX<any>> extends VModelXValue<M> implements IVModelX<M> {
  public static Value = VModelXValue;

  @computed
  public get id() {
    return this.domain.id.toString();
  }

  constructor(dtoLV: ILambda<M>) {
    super(dtoLV);
    makeObservable(this);
  }
}
