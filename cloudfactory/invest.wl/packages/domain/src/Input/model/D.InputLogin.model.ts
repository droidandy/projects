import { IDInputModelProps } from '../D.Input.types';
import { DInputValidator } from '../D.Input.validator';
import { DInputModel } from './D.Input.model';

/**
 * ввод логина
 */

export class DInputLoginModel extends DInputModel {
  public static validationChars = (value: string = '') =>
    /^[\w.-]*$/.test(value) ? undefined : 'Логин содержит недопустимые символы';

  public static validationStart = (value: string = '') =>
    /^[A-Za-z]/.test(value) ? undefined : 'Логин должен начинаться на букву';

  public static validationEnd = (value: string = '') =>
    /[A-Za-z0-9]$/.test(value) ? undefined : 'Логин должен заканчиваться на букву или цифру';

  constructor(props?: IDInputModelProps) {
    super(props);

    this.errorsSet(() => DInputValidator.required(this.value)
      ?? DInputValidator.lengthMin(this.value, 2, 'Логин должен содержать не менее 2 символов'),
      // ?? DInputLoginModel.validationChars(this.value)
      // ?? DInputLoginModel.validationStart(this.value)
      // ?? DInputLoginModel.validationEnd(this.value),
    );
  }
}
