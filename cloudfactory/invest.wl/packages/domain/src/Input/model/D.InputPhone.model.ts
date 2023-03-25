import { Formatter } from '@invest.wl/common';
import { DInputModel } from './D.Input.model';

export class DInputPhoneModel extends DInputModel {
  public static sanitize = (phone: string) => Formatter.phoneSanitize(phone);
  public static validate = (value: string = '', phoneLen = 11) =>
    DInputPhoneModel.sanitize(value).length < phoneLen ? 'Неверный номер' : undefined;
}
