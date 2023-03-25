import { OrderOptionsData, OrderType, TimeInForce } from '~/app/home/types/trade';

export enum Modals {
  ActionSheet = 'ActionSheet',
  CreateStackOrHunch = 'CreateStackOrHunch',
  TargetPrice = 'TargetPrice',
  TargetDate = 'TargetDate',
  EditDescription = 'EditDescription',
  Chart = 'Chart',
  OrderOptions = 'OrderOptions',
  SetOrderPrice = 'SetOrderPrice',
}

export type ModalParams = {
  targetPrice?: number;
  targetDate?: Date;
  description?: string;
  selectValues?: { title: string; value: string; }[];
  orderOptions?: OrderOptionsData;
};

export const ModalsInitialValues = {
  targetPrice: undefined,
  targetDate: undefined,
  description: undefined,
  selectValues: undefined,
  orderOptions: {
    orderType: OrderType.MarketOrder,
    extendedHours: false,
    timeInForce: TimeInForce.Day,
    price: 0,
  },
};
