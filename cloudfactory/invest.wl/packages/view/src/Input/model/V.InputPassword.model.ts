import { IDInputModel } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * ViewModel для ввода пароля
 */

export class VInputPasswordModel extends VInputModel {
  @observable public isSecure: boolean = true;

  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, props);
    makeObservable(this);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput);
  }

  @action.bound
  public toggleSecure() {
    this.isSecure = !this.isSecure;
  }
}
