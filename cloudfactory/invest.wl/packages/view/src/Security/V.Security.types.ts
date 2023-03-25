import { EDSecurityBiometryType } from '@invest.wl/core';
import { TVIconName } from '../Icon/V.Icon.types';
import { IVSecurityAccessBiometryPresentProps } from './present/V.SecurityAccessBiometry.present';
import { IVSecurityAccessCodePresentProps } from './present/V.SecurityAccessCode.present';
import { IVSecuritySettingsPresentProps } from './present/V.SecuritySettings.present';
import { IVSecurityUnlockPresentProps } from './present/V.SecurityUnlock.present';

export const VSecurityI18nTid = Symbol.for('VSecurityI18nTid');

export interface IVSecurityI18nData {
  name: string;
  iconName: TVIconName;
  actionText: string;
  accessTitle: string;
  accessText: string;
  unlockText: string;
  errorText: string;
}

export interface IVSecurityI18n {
  readonly code: IVSecurityI18nData;
  readonly [EDSecurityBiometryType.Finger]: IVSecurityI18nData;
  readonly [EDSecurityBiometryType.Face]: IVSecurityI18nData;
  readonly biometry?: IVSecurityI18nData;
}

export enum EVSecurityScreen {
  SecurityAccessCode = 'SecurityAccessCode',
  SecurityAccessBiometry = 'SecurityAccessBiometry',
  SecurityUnlock = 'SecurityUnlock',
  SecuritySettings = 'SecuritySettings',
}

export interface IVSecurityScreenParams {
  SecurityAccessCode: IVSecurityAccessCodePresentProps;
  SecurityAccessBiometry: IVSecurityAccessBiometryPresentProps;
  SecurityUnlock: IVSecurityUnlockPresentProps;
  SecuritySettings: IVSecuritySettingsPresentProps;
}

