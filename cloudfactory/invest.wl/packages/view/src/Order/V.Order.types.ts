import { EDOrderStatus } from '@invest.wl/core';
import { IVOrderCreatePresentProps } from './present/V.OrderCreate.present';
import { IVOrderListPresentProps } from './present/V.OrderList.present';

export const VOrderI18nTid = Symbol.for('VOrderI18nTid');

export enum EVOrderScreen {
  OrderList = 'OrderList',
  OrderCreate = 'OrderCreate',
}

export interface IVOrderScreenParams {
  OrderList: IVOrderListPresentProps;
  OrderCreate: IVOrderCreatePresentProps;
}

export interface IVOrderI18n {
  readonly status: { [S in EDOrderStatus]: string };
}
