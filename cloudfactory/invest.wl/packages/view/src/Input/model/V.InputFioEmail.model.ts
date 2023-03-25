import { IDInputModel } from '@invest.wl/domain';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * ViewModel для ввода ФИО
 */

export class VInputFioEmailModel extends VInputModel {
  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, props);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput);
  }
}
