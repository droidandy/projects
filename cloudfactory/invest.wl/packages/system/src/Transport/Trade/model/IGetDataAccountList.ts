export interface IDataAccountListRequest {
  instrumentId?: number;
}

export interface IDataAccountListResponse extends Array<IDataAccountListResponseItem> {}

export interface IDataAccountListResponseItem {
  AccountId: number;
  Name: string;
  IsStrategy: boolean;
  IsTradingAccount: boolean;
  FreeCash: number;
  Client: Client;
  MarketValue: number;
  TradeAccountMapId: string;
  ClientCode: string;
  DisplayName: string;
  FreeInstrumentAmount: number;
  FreeCashInstrumentCurrency: number;
  Type: string;
  FreeMoney: FreeMoney;
  CanOrderSP: number;
  Board: string;
}

interface Client {
  ClientId: number;
  Name: string;
  Agreement: string;
  AgreementId: number;
}

interface FreeMoney {
  RUR: number;
  EUR: number;
  USD: number;
}
