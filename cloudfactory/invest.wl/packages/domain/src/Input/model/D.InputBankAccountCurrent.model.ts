import { IDInputModelProps } from '../D.Input.types';
import { DInputValidator } from '../D.Input.validator';
import { DInputModel } from './D.Input.model';

/**
 * Поле ввода расчетного (текуший) счета.
 */
export class DInputBankAccountCurrentModel extends DInputModel {
  constructor(props?: IDInputModelProps) {
    super(props);
    this.errorsSet(() => this.errorsValidator ?? DInputValidator.lengthEq(this.value, 20));
  }
}
