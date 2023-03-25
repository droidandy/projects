import { IDInputModelProps } from '../D.Input.types';
import { DInputValidator } from '../D.Input.validator';
import { DInputModel } from './D.Input.model';

// ввод Паспорта (серия и номер)

export class DInputPassportModel extends DInputModel<[string, string]> {
  constructor(props?: IDInputModelProps) {
    super(props);
    this.errorsSet(() => this.errorsValidator ?? DInputValidator.lengthEq(this.value?.join(''), 10));
  }
}
