import { Injectable } from '@invest.wl/core';
import { EDErrorBusinessCode, EDErrorProgCode } from './D.Error.types';

export const DErrorConfigTid = Symbol.for('DErrorConfigTid');

@Injectable()
export class DErrorConfig {
  public businessCode2Message: { [code: number]: string } = {
    [EDErrorBusinessCode.NotLoaded]: 'Тестовая ошибка',
    [EDErrorBusinessCode.FormNotValid]: 'Неверно заполнена форма',
  };

  public progCode2Message: { [code: number]: string } = {
    [EDErrorProgCode.NotInitialized]: 'Класс не инициализирован',
  };
}
