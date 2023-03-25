import { EDDateDayPart, Injectable } from '@invest.wl/core';
import { IVDateI18n } from './V.Date.types';

@Injectable()
export class VDateI18n implements IVDateI18n {
  public monthNumber = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public monthShort = ['Янв.', 'Фев.', 'Март', 'Aпр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Ноя.', 'Дек.'];
  public monthFull = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  public dayPartWelcome = {
    [EDDateDayPart.Morning]: 'доброе утро!',
    [EDDateDayPart.Afternoon]: 'добрый день!',
    [EDDateDayPart.Evening]: 'добрый вечер!',
    [EDDateDayPart.Night]: 'доброй ночи!',
  };
}
