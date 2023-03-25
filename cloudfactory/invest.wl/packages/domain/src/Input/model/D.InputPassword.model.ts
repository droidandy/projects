import { IDInputModelProps } from '../D.Input.types';
import { DInputModel } from './D.Input.model';

/**
 * ввода пароля
 */

export class DInputPasswordModel extends DInputModel {
  public static validationUppercase = (value: string = '') =>
    /[A-Z]/.test(value) ? undefined : 'Пароль не содержит заглавных букв';

  public static validationLowercase = (value: string = '') =>
    /[a-z]/.test(value) ? undefined : 'Пароль не содержит маленьких букв';

  public static validationNumber = (value: string = '') =>
    /[0-9]/.test(value) ? undefined : 'Пароль не содержит ни одной цифры';

  public static validationSymbol = (value: string = '') =>
    /[!@#$%^&*()_\-+="№;:?]/.test(value) ? undefined : 'Пароль должен содержать спецсимвол';

  constructor(props?: IDInputModelProps) {
    super(props);

    this.errorsSet(() => {
      return this.errorsValidator;
      // ?? DInputValidator.LengthMin(this.value, 8, 'Пароль должен содержать не менее 8 символов')
      // ?? DInputPasswordModel.validationUppercase(this.value)
      // ?? DInputPasswordModel.validationLowercase(this.value)
      // ?? DInputPasswordModel.validationNumber(this.value)
      // ?? DInputPasswordModel.validationSymbol(this.value);
    });
  }
}
