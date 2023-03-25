import { ILambda, lambdaResolve } from '@invest.wl/common';
import { action, computed, makeObservable, observable } from 'mobx';
import { IDInputModel, IDInputModelProps } from '../D.Input.types';
import { DInputValidator } from '../D.Input.validator';
import { DInputModel } from './D.Input.model';

/**
 * ввод числового значения.
 */

type TValue = number;

export interface IDInputNumberModel extends IDInputModel<TValue> {
  readonly step?: number;
  readonly min?: number;
  readonly max?: number;
  readonly precision?: number;
  minSet(min?: ILambda<TValue | undefined>): void;
  maxSet(max?: ILambda<TValue | undefined>): void;
  precisionSet(precision?: ILambda<TValue | undefined>): void;
}

interface IDInputNumberModelProps extends IDInputModelProps {
  step?: number;
}

export class DInputNumberModel extends DInputModel<TValue> implements IDInputNumberModel {
  public step?: number;
  @observable private _min: TValue | undefined | (() => TValue | undefined);
  @observable private _max: TValue | undefined | (() => TValue | undefined);
  @observable private _precision: number | undefined | (() => number | undefined);

  constructor(props?: IDInputNumberModelProps) {
    super(props);
    this.step = props?.step;
    this.errorsSet(() => this.errorsValidator
      ?? DInputValidator.numberMin(this.value, this.min)
      ?? DInputValidator.numberMax(this.value, this.max),
    );

    // ❌ @action.bound не использовать! Если использовать, то косячит вызов в дочерних классах через super
    this.minSet = this.minSet.bind(this);
    this.maxSet = this.maxSet.bind(this);
    this.precisionSet = this.precisionSet.bind(this);
    makeObservable(this);
  }

  @computed
  public get min() {
    return lambdaResolve(this._min);
  }

  @computed
  public get max() {
    return lambdaResolve(this._max);
  }

  @computed
  public get precision() {
    return lambdaResolve(this._precision);
  }


  @action
  public minSet(min?: ILambda<TValue | undefined>) {
    this._min = min;
    return this;
  }

  @action
  public maxSet(max?: ILambda<TValue | undefined>) {
    this._max = max;
    return this;
  }

  @action
  public precisionSet(precision?: ILambda<TValue | undefined>) {
    this._precision = precision;
    return this;
  }
}
