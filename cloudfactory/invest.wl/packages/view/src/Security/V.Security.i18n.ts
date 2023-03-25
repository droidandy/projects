import { EDSecurityBiometryType, Inject, Injectable } from '@invest.wl/core';
import { DSecurityStore, DSecurityStoreTid } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVSecurityI18n, IVSecurityI18nData } from './V.Security.types';

@Injectable()
export class VSecurityI18n implements IVSecurityI18n {
  constructor(
    @Inject(DSecurityStoreTid) private _store: DSecurityStore,
  ) {
    makeObservable(this);
  }

  public code: IVSecurityI18nData = {
    name: 'Пин-код',
    iconName: 'calculator',
    actionText: 'введите Пин-код',
    accessTitle: 'Установка Пин-кода',
    accessText: 'Введите Пин-код для \nподключения входа по коду',
    unlockText: 'Введите Пин-код\n, чтобы войти в приложение',
    errorText: 'Неверный Пин-код',
  };

  public [EDSecurityBiometryType.Finger]: IVSecurityI18nData = {
    name: 'Touch ID',
    iconName: 'bio-finger',
    actionText: 'прикоснитесь к сенсору',
    accessTitle: 'Установка отпечатка',
    accessText: 'Прикоснитесь к сенсору для \nподключения входа по отпечатку пальца',
    unlockText: 'Прикоснитесь к сканеру отпечатка\nпальцев, чтобы войти в приложение',
    errorText: 'Отпечаток не распознан',
  };

  public [EDSecurityBiometryType.Face]: IVSecurityI18nData = {
    name: 'Face ID',
    iconName: 'bio-face',
    actionText: 'посмотрите в камеру',
    accessTitle: 'Установка Face ID',
    accessText: 'Посмотрите в камеру для \nподключения входа по Face ID',
    unlockText: 'Прикоснитесь к сканеру отпечатка\nпальцев, чтобы войти в приложение',
    errorText: 'Лицо не распознано',
  };

  @computed
  public get biometry(): IVSecurityI18nData | undefined {
    return this[this._store.biometryType!];
  }
}
