import { IDInputModel } from '@invest.wl/domain';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * Поле ввода строкового значения.
 */
export class VInputStringModel extends VInputModel {
  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, props);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput);
  }
}
