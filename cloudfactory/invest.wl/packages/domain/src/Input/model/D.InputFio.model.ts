import { IDInputModelProps } from '../D.Input.types';
import { DInputModel } from './D.Input.model';

/**
 * ввод Email
 */

export class DInputFioModel extends DInputModel {
  public static validationFio = (value: string = '') =>
    /^[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{0,}\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,}(\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,})?$/.test(value) ? undefined : 'Неверное значение';

  constructor(props?: IDInputModelProps) {
    super(props);
    this.errorsSet(() => this.errorsValidator ?? DInputFioModel.validationFio(this.value));
  }
}
