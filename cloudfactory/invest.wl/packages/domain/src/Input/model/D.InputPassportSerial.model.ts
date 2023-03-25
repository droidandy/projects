import { IDInputModelProps } from '../D.Input.types';
import { DInputModel } from './D.Input.model';

/**
 * ввод серии паспорта
 */

export class DInputPassportSerialModel extends DInputModel {
  public static validationSerial = (value: string = '') =>
    /^\d{4}$/.test(value) ? undefined : 'Неверное значение';

  constructor(props?: IDInputModelProps) {
    super(props);
    this.errorsSet(() => this.errorsValidator ?? DInputPassportSerialModel.validationSerial(this.value));
  }
}
