import { ILambda, lambdaResolve } from '@invest.wl/common';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { EVButtonState, IVButtonModelProps } from './V.Button.types';

// TODO: refact for more performance (rerender)
export class VButtonModel<C> {
  @computed
  public get touchableProps() {
    return {
      disabled: this.disabled,
      context: this.props.context,

      onPressIn: this._onPressIn,
      onPressOut: this._onPressOut,
      onPress: this.onPress,
    };
  };

  @observable private _isPressing = false;
  @observable private _isProcessing = false;

  @computed
  public get props() {
    return lambdaResolve(this._propsLv);
  }

  @computed
  public get state() {
    if (this.props?.processing) return EVButtonState.Processing;
    if (this.props?.disabled) return EVButtonState.Disabled;
    if (this._isPressing) return EVButtonState.Press;
    return EVButtonState.Normal;
  }

  @computed
  public get isProcessing() {
    return this.props?.processing ?? this._isProcessing;
  }

  @computed
  public get disabled() {
    return this.props?.disabled || this.isProcessing || !(this.props?.pressable ?? true);
  }

  constructor(private _propsLv: ILambda<IVButtonModelProps<C>>) {
    makeObservable(this);
  }

  @action.bound
  public onPressing(isPressing: boolean) {
    this._isPressing = isPressing;
  }

  @action.bound
  private _onPressIn() {
    this._isPressing = true;
  }

  @action.bound
  private _onPressOut() {
    this._isPressing = false;
  }

  @action.bound
  public async onPress(context: C) {
    try {
      this._isProcessing = true;
      await this.props.onPress?.(context);
    } finally {
      runInAction(() => this._isProcessing = false);
    }
  }
}
