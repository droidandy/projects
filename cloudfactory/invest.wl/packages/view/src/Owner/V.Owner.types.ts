import { IVOwnerContactPresentProps } from './present/V.OwnerContact.present';
import { IVOwnerInfoPresentProps } from './present/V.OwnerInfo.present';
import { IVOwnerTermsPresentProps } from './present/V.OwnerTerms.present';

export const VOwnerConfigTid = Symbol.for('VOwnerConfigTid');

export interface IVOwnerConfig {
  text: string;
}

export enum EVOwnerScreen {
  OwnerInfo = 'OwnerInfo',
  OwnerContact = 'OwnerContact',
  OwnerTerms = 'OwnerTerms',
}

export interface IVSupportScreenParams {
  OwnerInfo: IVOwnerInfoPresentProps;
  OwnerContact: IVOwnerContactPresentProps;
  OwnerTerms: IVOwnerTermsPresentProps;
}

