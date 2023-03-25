import { EDAccountBoard, EDAccountMarketType, EDAccountAgreementType } from '@invest.wl/core';
import { IVAccountListPresentProps } from './present/V.AccountList.present';

export const VAccountI18nTid = Symbol.for('VAccountI18nTid');

export enum EVAccountScreen {
  AccountList = 'AccountList',
}

export interface IVAccountScreenParams {
  AccountList: IVAccountListPresentProps;
}

export interface IVAccountI18n {
  marketType: { [T in EDAccountMarketType]: string };
  board: { [T in EDAccountBoard]: string };
  agreementType: { [T in EDAccountAgreementType]: string };
}
