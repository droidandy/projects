import { IVOperationDepositCreatePresentProps } from './present/V.OperationDepositCreate.present';
import { IVOperationListPresentProps } from './present/V.OperationList.present';

export const VOperationI18nTid = Symbol.for('VOperationI18nTid');

export enum EVOperationScreen {
  OperationList = 'OperationList',
  OperationDepositCreate = 'OperationDepositCreate',
}

export interface IVOperationScreenParams {
  OperationList: IVOperationListPresentProps;
  OperationDepositCreate: IVOperationDepositCreatePresentProps;
}
