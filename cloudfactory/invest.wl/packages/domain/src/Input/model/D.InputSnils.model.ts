import { IDInputModelProps } from '../D.Input.types';
import { DInputValidator } from '../D.Input.validator';
import { DInputModel } from './D.Input.model';

// Проверка контрольного числа Страхового номера проводится только для номеров больше номера 001-001-998
// ввод СНИЛС

export class DInputSnilsModel extends DInputModel {
  // Проверка контрольного числа Страхового номера проводится только для номеров больше номера 001-001-998
  public static validateFrom = '001001998';
  public static inputRegExp = /(\d){3}-(\d){3}-(\d){3}\s(\d){2}/;

  private static _controlSum(digits: number[]): number {
    // Каждая цифра СНИЛС умножается на номер своей позиции (позиции отсчитываются с конца)
    // Полученные произведения суммируются
    // digits = digits.reverse()
    digits = [...digits].reverse();
    let result = digits.reduce((sum, _, index) => {
      return sum + (index + 1) * digits[index];
    }, 0);

    while (true) {
      if (result < 100) return result;
      if (result === 100 || result === 101) return 0; // 00
      result = result % 101;
    }
  }

  public static validate(value?: string) {
    if (!value) return undefined;
    let ok = true;
    const numberSrt = value.slice(0, value.length - 2);
    const checkStr = value.slice(value.length - 2);

    if (numberSrt >= DInputSnilsModel.validateFrom) {
      const digits = numberSrt.split('').map(c => parseInt(c, 10));
      const controlSum = this._controlSum(digits);
      const checkSum = parseInt(checkStr, 10);
      ok = controlSum === checkSum;
    }

    return ok ? undefined : 'Введите корректный СНИЛС';
  }

  constructor(props?: IDInputModelProps) {
    super(props);
    this.errorsSet(() => this.errorsValidator
      ?? DInputValidator.lengthMin(this.value, 11)
      ?? DInputSnilsModel.validate(this.value));
  }
}
