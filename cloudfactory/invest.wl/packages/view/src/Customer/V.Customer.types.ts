import { IVCustomerAccountSelfPresentProps } from './present/V.CustomerAccountSelf.present';

export enum EVCustomerScreen {
  CustomerAccountSelf = 'CustomerAccountSelf',
}

export interface IVCustomerScreenParams {
  CustomerAccountSelf: IVCustomerAccountSelfPresentProps;
}
