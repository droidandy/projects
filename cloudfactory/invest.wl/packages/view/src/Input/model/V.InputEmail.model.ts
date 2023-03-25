import { IDInputModel } from '@invest.wl/domain';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * ViewModel для ввода email'a
 */

export class VInputEmailModel extends VInputModel {
  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, { pattern: '/^[A-Za-z0-9_.-]+@[A-Za-z0-9_.-]+\\.[A-Za-z]$/', ...props });
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput);
  }
}
