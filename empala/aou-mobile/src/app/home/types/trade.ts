export type OrderOptionsData = {
  companyName: string,
  tradeType: TradeType,
  orderType?: OrderType | undefined,
  extendedHours?: boolean,
  timeInForce?: TimeInForce,
  userPrice?: number,
};

export enum OrderType {
  MarketOrder = 'MarketOrder',
  LimitOrder = 'LimitOrder',
  StopOrder = 'StopOrder',
}

export enum TimeInForce {
  Day = 'Day',
  GTC = 'GTC',
}

export enum TradeType {
  buy = 'BUY',
  sell = 'SELL',
}

export enum OrderStatus {
  open = 'Open',
  filled = 'Filled',
  failed = 'Failed',
  canceled = 'Canceled',
}

type Company = {
  name: string;
  sym: string;
  image: JSX.Element;
};

export type Order = {
  id: string;
  company: Company;
  type: TradeType;
  value: number;
  shares: number;
  status: OrderStatus;
  statusDate: Date;
};
