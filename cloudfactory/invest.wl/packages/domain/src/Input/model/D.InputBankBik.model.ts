import { IDInputModelProps } from '../D.Input.types';
import { DInputValidator } from '../D.Input.validator';
import { DInputModel } from './D.Input.model';

/**
 * ввод БИК.
 */
export class DInputBankBikModel extends DInputModel {
  constructor(props?: IDInputModelProps) {
    super(props);
    this.errorsSet(() => this.errorsValidator ?? DInputValidator.lengthEq(this.value, 9));
  }
}
