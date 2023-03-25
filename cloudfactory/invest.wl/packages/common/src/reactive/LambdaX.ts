import isFunction from 'lodash/isFunction';
import { action, computed, makeObservable, observable, when } from 'mobx';

export type ILambda<V, Args = unknown> = V | ((args?: Args) => V);

// Если value функция, вызвать для получения значения, иначе вернуть value.
// @deprecated - use LambdaX.resolve
export function lambdaResolve<V, TArgs = unknown>(value: ILambda<V>, args?: TArgs): V {
  return isFunction(value) ? value(args) : value;
}

export interface ILambdaX<T> {
  readonly value: T;
  setValue(value: ILambda<T>): void;
}

export class LambdaX<T> implements ILambdaX<T> {
  public static resolve = lambdaResolve;

  @observable.ref private _value: ILambda<T>;

  constructor(value: ILambda<T>) {
    this._value = value;
    makeObservable(this);
  }

  @action
  public setValue(value: ILambda<T>) {
    this._value = value;
  }

  @computed
  public get value() {
    return LambdaX.resolve(this._value);
  }

  @computed
  public get isLambda() {
    return isFunction(this._value);
  }

  public whenChanged() {
    const value = this.value;
    return when(() => this.value !== value);
  }
}
