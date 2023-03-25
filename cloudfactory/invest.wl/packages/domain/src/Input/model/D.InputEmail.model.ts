import { IDInputModelProps } from '../D.Input.types';
import { DInputModel } from './D.Input.model';

/**
 * ввод Email
 */

export class DInputEmailModel extends DInputModel {
  public static validationEmail = (value: string = '') =>
    !value || /^[A-Za-z0-9_.-]+@[A-Za-z0-9_.-]+\.[A-Za-z]{2,5}$/.test(value) ? undefined : 'Неверное значение';

  constructor(props?: IDInputModelProps) {
    super(props);
    this.errorsSet(() => this.errorsValidator ?? DInputEmailModel.validationEmail(this.value));
  }
}
