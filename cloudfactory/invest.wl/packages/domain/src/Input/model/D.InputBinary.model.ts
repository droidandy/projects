import { computed, makeObservable, observable } from 'mobx';
import { IDInputModel, IDInputModelProps } from '../D.Input.types';
import { DInputModel } from './D.Input.model';

/**
 * Выбор бинарных значений (чекбокс,  из 2ух)
 */

export type TDInputBinary = string | number | boolean | undefined;

export interface IDInputBinaryModel<T extends TDInputBinary = boolean> extends IDInputModel<T> {
  readonly values: [T, T];
  readonly isChecked: boolean;
  toggle(): void;
}

export interface IDInputBinaryModelProps<T extends TDInputBinary> extends IDInputModelProps {
  // [false, true]
  values?: [T, T];
}

export class DInputBinaryModel<T extends TDInputBinary = boolean> extends DInputModel<T> implements IDInputBinaryModel<T> {
  @observable public readonly values: [T, T];

  @computed
  public get isChecked() {
    return this.value === this.values[1];
  }

  constructor(props: IDInputBinaryModelProps<T> = {}) {
    super(props);
    makeObservable(this);
    this.values = props.values ?? [false, true] as [T, T];
    this.valueSet(this.values[0]);

    this.toggle = this.toggle.bind(this);
  }

  public toggle() {
    const nextValue = this.value === this.values[0] ? this.values[1] : this.values[0];
    this.valueSet(nextValue);
  }
}
