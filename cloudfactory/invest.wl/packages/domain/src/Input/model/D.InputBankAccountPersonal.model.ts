import { IDInputModelProps } from '../D.Input.types';
import { DInputValidator } from '../D.Input.validator';
import { DInputModel } from './D.Input.model';

/**
 * Поле ввода лицевого счета.
 */
export class DInputBankAccountPersonalModel extends DInputModel {
  constructor(props?: IDInputModelProps) {
    super(props);
    this.errorsSet(() => this.errorsValidator ?? DInputValidator.lengthMax(this.value, 30));
  }
}
