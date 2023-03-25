import { EDAccountBoard, EDAccountAgreementType } from '@invest.wl/core';

export interface IDataAccountListRequest {
  instrumentId?: number;
}

export interface IDataAccountListResponse extends Array<IDataAccountListResponseItem> {
}

export interface IDataAccountListResponseItem {
  AccountId: number;
  Name: string;
  IsStrategy: boolean;
  IsTradingAccount: boolean;
  FreeCash: number;
  Client?: {
    ClientId: number;
    Name: string;
    Agreement?: string;
    AgreementId?: number;
  };
  MarketValue: number;
  TradeAccountMapId: string;
  ClientCode?: string;
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
  Board?: EDAccountBoard;
}
