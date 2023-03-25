import isFunction from 'lodash/isFunction';
import { action, computed, makeObservable, observable } from 'mobx';
import { ILambda, lambdaResolve } from '../LambdaX';
import { IDModelX, IDModelXValue, IModelBase } from './ModelX.types';

export abstract class DModelXValue<DTO> implements IDModelXValue<DTO> {
  @observable.ref protected _dtoLV: ILambda<DTO>;

  constructor(dtoLV: ILambda<DTO>) {
    makeObservable(this);
    this._dtoLV = dtoLV;
  }

  @computed
  public get dto() {
    return lambdaResolve(this._dtoLV);
  }

  @computed
  public get isLambda() {
    return isFunction(this._dtoLV);
  }

  // @deprecated - использовать lvSet()
  public dtoSet(dtoLV: ILambda<DTO>) {
    this.lvSet(dtoLV);
  }

  @action
  public lvSet(dtoLV: ILambda<DTO>) {
    this._dtoLV = dtoLV;
  }
}

export abstract class DModelX<DTO extends IModelBase> extends DModelXValue<DTO> implements IDModelX<DTO> {
  public static Value = DModelXValue;

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  @computed
  public get id() {
    return this.dto.id.toString();
  }
}

