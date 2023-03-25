import { ILambda, lambdaResolve } from '@invest.wl/common';
import { IDInputModel } from '@invest.wl/domain';
import { action, computed, makeObservable, observable } from 'mobx';

type TVInputValue = string | undefined;

export interface IVInputModelProps {
  pattern?: string;
  // если значение никогда не будет меняться через view - тогда нужно TRUE
  // например в домене мы установили InstrumentId в модели запроса и менять его больше не будем
  valueSetSkip?: boolean;
}

export interface IInputEvents<ValueIn = TVInputValue> {
  onFocus(): void;
  onBlur(): void;
  onChangeText(text: string): void;
}

export interface IVInputModel<ValueIn = TVInputValue> extends IInputEvents<ValueIn> {
  readonly inputEvents: IInputEvents<ValueIn>;
  /**
   * Последнее сырое значение, вводимое в поле
   */
  readonly valueInput?: ValueIn;
  /**
   * Отформатированое значение для отрисовки, берется из доменной модели ввода
   */
  readonly value?: string;
  /**
   * Набор ошибок валидации.
   */
  readonly errors?: string[];
  /**
   * Значение placeholder для поля
   */
  readonly placeholder?: string;
  /**
   * Признак того, нужно ли показывать ошибку валидации.
   * Изначально поле может быть не валидно, но ошибку показывать не надо.
   * По-умолчанию показываем ошибку, когда isChanged = true.
   */
  readonly isDisplayErrors: boolean;
  /**
   * Набор ошибок, если isDisplayErrors = true. Удобно для передачи в поле.
   */
  readonly displayErrors?: string[];
  readonly displayError?: string;
  /**
   * Активен ли инпут в данный момент
   */
  readonly isFocused: boolean;
  /**
   * Валидно ли текущее значение
   */
  readonly isValid: boolean;
  /**
   * Было ли введено значение через UI
   */
  readonly isChanged: boolean;
  /**
   * Было ли взаимодействие с контролом
   */
  readonly isTouched: boolean;
  /**
   * isChanged && isTouched
   */
  readonly isDirty: boolean;
  /**
   * задизэйблен ли контрол
   */
  readonly isDisabled: boolean;

  /**
   * Задать сырое значение поля.
   * @param inputValue
   */
  valueInputSet(inputValue?: ILambda<ValueIn | undefined>): this;
  /**
   * Задать значение поля или расчётную функцию, в которой можно через замыкание парсить inputValue поля.
   * @param value
   */
  valueSet(value?: ILambda<string | undefined>): this;
  /**
   * Задать признак того, нужно ли показывать ошибку валидации или расчётную функцию,
   * в которой можно через замыкание проверять состояние поля через его свойства.
   * @param displayErrors
   */
  errorsDisplaySet(displayErrors: ILambda<boolean>): this;
  /**
   * Изменить isDirty инпута
   */
  dirtySet(dirty?: boolean): this;
  /**
   * Задать значение placeholder
   * @param value
   */
  placeholderSet(value: ILambda<string | undefined>): this;
  /**
   * Сбросить состояние инпута в изначальное
   */
  reset(): void;
  disabledSet(disabled: boolean): this;
  onChange(v?: ValueIn): void;
}

/**
 * Поле ввода значения произвольного типа.
 * Значение проходит VInputModel.valueInput -> DInputModel.value -> VInputModel.value
 * таким образом даже если мы установим значение в домене, минуя valueInput, VInputModel.value всеравно будет актуален
 */
export class VInputModel<M extends IDInputModel<any> = IDInputModel<TVInputValue>, ValueIn = TVInputValue> implements IVInputModel<ValueIn> {
  public readonly inputEvents: IInputEvents<ValueIn>;

  @observable private _valueInput: ILambda<ValueIn | undefined>;
  @observable private _value: ILambda<string | undefined> = () => this.domain.value?.toString();
  // default: isDisplayErrors - показываем ошибку, после изменения поля
  @observable.ref private _isDisplayErrors: ILambda<boolean> = () => this.isDirty;

  @observable private _isFocused = false;
  @observable private _isChanged = false;
  @observable private _isTouched = false;

  @computed
  public get isDirty() {
    return this._isChanged && this._isTouched;
  }

  private _placeholder: ILambda<string | undefined>;

  constructor(public domain: M, protected _props: IVInputModelProps = {}) {
    const self = this;
    this.inputEvents = {
      get onBlur() { return self.onBlur; },
      get onFocus() { return self.onFocus; },
      get onChangeText() { return self.onChangeText; },
    };

    // ❌ @action.bound не использовать! Если использовать, то косячит вызов в дочерних классах через super
    this.onChangeText = this.onChangeText.bind(this);
    this.onChange = this.onChange.bind(this);
    this.valueSet = this.valueSet.bind(this);
    this.placeholderSet = this.placeholderSet.bind(this);
    this.errorsDisplaySet = this.errorsDisplaySet.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    makeObservable(this);
  }

  @computed
  public get valueInput() {
    return lambdaResolve(this._valueInput);
  }

  @computed
  public get value() {
    return lambdaResolve(this._value);
  }

  @computed
  public get errors() {
    return this.domain.errors;
  }

  @computed
  public get isValid() {
    return this.domain.isValid;
  }

  @computed
  public get isChanged() {
    return this._isChanged;
  }

  @computed
  public get isTouched() {
    return this._isTouched;
  }

  @computed
  public get isFocused() {
    return this._isFocused;
  }

  @computed
  public get isDisabled() {
    return this.domain.isDisabled;
  }

  @computed
  public get isDisplayErrors() {
    return lambdaResolve(this._isDisplayErrors);
  }

  @computed
  public get displayErrors() {
    return this.isDisplayErrors ? this.errors : undefined;
  }

  @computed
  public get displayError() {
    return this.displayErrors ? this.displayErrors[0] : undefined;
  }

  @computed
  public get placeholder() {
    return lambdaResolve(this._placeholder);
  }

  @computed
  protected get _pattern() {
    return this._props.pattern ? new RegExp(this._props.pattern, 'g') : undefined;
  }

  @action
  public valueInputSet(value?: ILambda<ValueIn | undefined>) {
    this._valueInput = value;
    return this;
  }

  @action
  public valueSet(value?: string | undefined | (() => string | undefined)) {
    this._value = value;
    return this;
  }

  @action
  public dirtySet(dirty = true) {
    this._isChanged = dirty;
    this._isTouched = dirty;
    return this;
  }

  @action
  public placeholderSet(value?: ILambda<string | undefined>) {
    this._placeholder = value;
    return this;
  }

  @action
  public errorsDisplaySet(displayErrors: boolean | (() => boolean)) {
    this._isDisplayErrors = displayErrors;
    return this;
  }

  @action
  public reset() {
    this.valueInputSet();
    this.dirtySet(false);
    this._isFocused = false;
  }

  @action
  public onBlur() {
    this._isFocused = false;
    this._isTouched = true;
  }

  @action
  public onFocus() {
    this._isFocused = true;
  }

  @action
  public onChangeText(text: string) {
    if (this._pattern) text = text.replace(this._pattern, '');
    this.onChange(text as unknown as ValueIn);
  }

  @action
  public onChange(v: ValueIn | undefined) {
    // Если в поле вручную вносятся изменения
    if (this._isFocused) this._isChanged = true;
    this.valueInputSet(v);
  }

  @action
  public disabledSet(disabled: ILambda<boolean>) {
    this.domain.disabledSet(disabled);
    return this;
  }
}
