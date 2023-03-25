import { EDAccountBoard, EDAccountAgreementType } from '@invest.wl/core';

export interface IGetTradingDataAccountListRequest {
  instrumentId?: number;
  classcode?: string;
  securcode?: string;
  currencyName?: string;
}

export interface IGetTradingDataAccountListResponse extends Array<IGetTradingDataAccountListResponseItem> {}

export interface IGetTradingDataAccountListResponseItem {
  AccountId: number;
  Name: string;
  IsStrategy: boolean;
  IsTradingAccount: boolean;
  FreeCash: number;
  Client: {
    ClientId: number;
    Name: string;
    Agreement: string;
    ParentAgreement?: string;
    Kind?: number;
    OpenDate?: Date;
    QIType?: number;
    Tariff?: {
      TariffId: number;
      Text: string;
      Name: string;
      Details: string;
    };
  };
  MarketValue: number;
  TradeAccountMapId: string;
  ClientCode: string;
  DisplayName?: string;
  FreeInstrumentAmount: number;
  FreeCashInstrumentCurrency: number;
  Type: EDAccountAgreementType;
  FreeMoney: {
    RUR: number;
    EUR: number;
    USD: number;
  };
  CanOrderSP: number;
  Board: EDAccountBoard;
  MinAmount?: number;
  FreeMoneyTx?: number;
}
