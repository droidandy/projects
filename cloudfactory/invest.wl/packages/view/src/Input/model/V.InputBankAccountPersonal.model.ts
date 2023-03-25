import { IDInputModel } from '@invest.wl/domain';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * Поле ввода лицевого счета.
 */
export class VInputBankAccountPersonalModel extends VInputModel {
  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, { pattern: '[^0-9]', ...props });
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput?.replace(/\D/g, ''));
  }
}
