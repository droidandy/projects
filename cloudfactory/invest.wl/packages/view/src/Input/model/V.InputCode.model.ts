import { IDInputCodeModel } from '@invest.wl/domain';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * ViewModel для ввода sms кода
 */

export class VInputCodeModel extends VInputModel {
  public length: number;

  constructor(model: IDInputCodeModel, props?: IVInputModelProps) {
    super(model, props);
    this.length = model.length;
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput);
  }
}
