export enum EDTradeDirection {
  Buy = 1,
  Sell = -1,
}

// TODO: ask enum
export enum EDTradeState {
  UNKNOWN
}

export enum EDTradeMarket {
  Fund = 'Фондовый',
  Term = 'Срочный',
  Currency = 'Валютный',
}

// Режим торгов
export interface IDTradeSettle {
  Code: EDTradeSettleCode;
  // Текстовое описание режима торгов
  Description: string;
}

export enum EDTradeSettleCode {
  T0 = 'T0',
  T1 = 'T1',
  T2 = 'T2',
}
