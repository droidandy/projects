import { ILambda, lambdaResolve } from '@invest.wl/common';
import isFunction from 'lodash/isFunction';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { IDInputModel, IDInputModelProps, TDInputValue } from '../D.Input.types';

/**
 * Ввод значения произвольного типа.
 */
export class DInputModel<ValueIn = TDInputValue> implements IDInputModel<ValueIn> {
  @observable private _value: ILambda<ValueIn | undefined>;
  @observable.ref private _errors: ILambda<string | string[] | undefined> = () => this.errorsValidator;
  @observable.ref private _isValid: ILambda<boolean> = () => !this.errors;

  @observable private _isDisabled: ILambda<boolean> = false;
  // механизм временной подмены лямбда функции на чистое значение, до следующего обновления лямбды
  @observable private _valueTemp: ILambda<ValueIn | undefined>;
  private _valueTempSeen = false;

  @computed
  public get value() {
    if (this._valueTemp) {
      lambdaResolve(this._valueTemp);
      if (!this._valueTempSeen) {
        this._valueTempSeen = true;
      } else {
        setTimeout(() => {
          runInAction(() => {
            this._value = this._valueTemp;
            this._valueTemp = undefined;
          });
        });
      }
    }
    return lambdaResolve(this._value);
  }

  @computed
  public get isValid() {
    return lambdaResolve(this._isValid);
  }

  @computed
  public get isLambda() {
    return isFunction(this._value);
  }

  @computed
  public get isEmpty() {
    return this._value == null;
  }

  @computed
  public get isDisabled() {
    return lambdaResolve(this._isDisabled);
  }

  @computed
  public get errors() {
    const errors = lambdaResolve(this._errors);
    return !errors ? undefined : (Array.isArray(errors) ? errors : [errors]);
  }

  @computed
  public get errorsValidator(): string | undefined {
    return this._validatorList?.reduce((acc, v) => {
      const err = v(this.value);
      return acc + (err ? err + ' ' : '');
    }, '') || undefined;
  }

  @computed
  private get _validatorList() {
    return lambdaResolve(this._props.validatorList);
  }

  constructor(protected _props: IDInputModelProps = {}) {
    // ❌ @action.bound не использовать! Если использовать, то косячит вызов в дочерних классах через super
    this.valueSet = this.valueSet.bind(this);
    this.validSet = this.validSet.bind(this);
    this.errorsSet = this.errorsSet.bind(this);
    makeObservable(this);
  }

  @action
  public valueSet(value?: ILambda<ValueIn | undefined>) {
    if (this.isDisabled && !isFunction(value)) {
      return this;
    }
    if (!isFunction(value) && (isFunction(this._value) || !!this._valueTemp)) {
      this._valueTemp = this._valueTemp || this._value;
      this._valueTempSeen = false;
      this._value = value;
    } else {
      this._valueTemp = undefined;
      this._value = value;
    }
    return this;
  }

  @action
  public validSet(valid: ILambda<boolean>) {
    this._isValid = valid;
    return this;
  }

  @action
  public errorsSet(errors: ILambda<string | string[] | undefined>) {
    this._errors = errors;
    return this;
  }

  @action
  public disabledSet(disabled: ILambda<boolean>) {
    this._isDisabled = disabled;
    return this;
  }
}
