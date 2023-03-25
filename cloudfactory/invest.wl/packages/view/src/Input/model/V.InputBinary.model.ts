import { IDInputBinaryModel, TDInputBinary } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * Поле для выбора бинарных значений (чекбокс)
 */

export class VInputBinaryModel<T extends TDInputBinary = boolean> extends VInputModel<IDInputBinaryModel<T>> {
  @computed public get isChecked() {
    return this.domain.isChecked;
  }

  constructor(model: IDInputBinaryModel<T>, props?: IVInputModelProps) {
    super(model, props);
    makeObservable(this);
    this.onChange = this.onChange.bind(this);
  }

  public onChange() {
    this.domain.toggle();
  }
}
