import { EDSecurityBiometryType, ISErrorSecurityDTO, RNSecurityErrorEnum, SecurityErrorSubCodeAndroidEnum } from '@invest.wl/core';
import { Platform } from 'react-native';
import { ISErrorSecurityModel } from '../S.Error.types';
import { SErrorModel } from './S.Error.model';

type TDTO = ISErrorSecurityDTO;
const isAndroid = Platform.OS === 'android';

// TODO: нужно отвязаться от react-native-security ENUM. ввести свои?
// так же локализовать ошибки нужно на уровне View
export class SErrorSecurityModel<DTO extends TDTO = TDTO> extends SErrorModel<DTO> implements ISErrorSecurityModel<TDTO> {
  private _code?: RNSecurityErrorEnum;

  public get code(): RNSecurityErrorEnum {
    if (isAndroid) {
      if (this.dto.subCode === SecurityErrorSubCodeAndroidEnum.FINGERPRINT_ERROR_LOCKOUT) {return RNSecurityErrorEnum.FINGERPRINT_TO_MUCH_ATTEMPTS;}
      if (this.dto.subCode === SecurityErrorSubCodeAndroidEnum.FINGERPRINT_ERROR_CANCELED) {return RNSecurityErrorEnum.BIOMETRY_CANCELLED;}
    }
    return this._code || this.dto.code || -1;
  }

  public get signoutNeed() {
    return [RNSecurityErrorEnum.FINGERPRINT_TO_MUCH_ATTEMPTS, RNSecurityErrorEnum.PINCODE_TO_MUCH_ATTEMPTS].includes(this.code);
  }

  public get refreshNeed() {
    return false;
  }

  public get renewNeed() {
    return [RNSecurityErrorEnum.BIOMETRY_NEED_RENEW].includes(this.code);
  }

  public get continueCan() {
    return !this.signoutNeed && !this.renewNeed && ![RNSecurityErrorEnum.BIOMETRY_CANCELLED,
      RNSecurityErrorEnum.FINGERPRINT_NOT_SUPPORTED, RNSecurityErrorEnum.NO_TOUCHID_FINGERS,
      RNSecurityErrorEnum.NO_TOUCHID_FINGERS2].includes(this.code);
  }

  public get isCancelled() {
    return [RNSecurityErrorEnum.BIOMETRY_CANCELLED, RNSecurityErrorEnum.FINGERPRINT_CANCELED].includes(this.code);
  }

  public get message() {
    switch (this.code) {
      case RNSecurityErrorEnum.FINGERPRINT_FAILED:
        return 'Отпечаток не совпал, попробуйте ещё раз';

      case RNSecurityErrorEnum.FINGERPRINT_DECRYPT_FAILED:
      case RNSecurityErrorEnum.FINGERPRINT_ENCRYPT_INIT_FAILED:
        return 'Ошибка, попробуйте ещё раз';

      case RNSecurityErrorEnum.FINGERPRINT_BUSY:
        return 'Система занята';

      case RNSecurityErrorEnum.FINGERPRINT_TO_MUCH_ATTEMPTS:
        return 'Превышено системное количество попыток. Повторите попытку позже';

      case RNSecurityErrorEnum.FINGERPRINT_NOT_SUPPORTED:
        return 'Отпечаток не поддерживается системой';

      case RNSecurityErrorEnum.NO_TOUCHID_FINGERS:
      case RNSecurityErrorEnum.NO_TOUCHID_FINGERS2:
        return 'В системе нет установленных отпечатков';

      case RNSecurityErrorEnum.BIOMETRY_NEED_RENEW:
        return 'Блокировка экрана была отключена или добавлен\\удален отпечаток пальца. Пожалуйста, войдите, используя ПИН-код';

      case RNSecurityErrorEnum.PINCODE_TO_MUCH_ATTEMPTS:
        return 'Превышено максимальное количество попыток ввода PIN-кода.';

      case RNSecurityErrorEnum.PINCODE_CHECK_FAILED:
        return 'Неверный PIN-код';

      case RNSecurityErrorEnum.CANT_GET_LOGIN_PASSWORD:
        if (this.dto.subCode === EDSecurityBiometryType.Face) {
          return 'Лицо не распознано';
        } else {
          return 'Отпечаток не распознан';
        }
    }
    return `${super.message || 'Системный сбой, повторите попытку'}. Неизвестный код: ${this.code}`;
  }

  public set message(value: string) {
    this._message = value;
  }

  public get isNotified() {
    return this.isCancelled ? true : this._isNotified;
  }
}
