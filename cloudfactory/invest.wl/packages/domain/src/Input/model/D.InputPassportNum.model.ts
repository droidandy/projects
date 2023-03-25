import { IDInputModelProps } from '../D.Input.types';
import { DInputModel } from './D.Input.model';

/**
 * ввод номера паспорта
 */

export class DInputPassportNumModel extends DInputModel {
  public static validation = (value: string = '') =>
    /^\d{6}$/.test(value) ? undefined : 'Неверное значение';

  constructor(props?: IDInputModelProps) {
    super(props);
    this.errorsSet(() => this.errorsValidator ?? DInputPassportNumModel.validation(this.value));
  }
}
