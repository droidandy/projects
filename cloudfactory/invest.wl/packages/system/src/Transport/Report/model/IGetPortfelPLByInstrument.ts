import { EDAccountMarketType, IDCurrencyDTO } from '@invest.wl/core';

export interface IGetPortfelPLByInstrumentRequest {
  dateFrom: Date | string;
  dateTo: Date | string;
  clients: string;
  assetType?: number;
  currencyName?: string;
  instrumentId?: number;
  accounts?: string;
}

export interface IGetPortfelPLByInstrumentResponse extends Array<IGetPortfelPLByInstrumentResponseItem> { }

export interface IGetPortfelPLByInstrumentResponseItem {
  Account: IAccount;
  AssetType: number;
  AssetSubType: number;
  AvgCostBuy?: number;
  AvgCostSell?: number;
  BuyAmount: number;
  Client: IClient;
  Commission?: number;
  CouponPL: number;
  CouponPLInstr: number;
  MarketValue: number;
  TotalPL: number;
  Yield: number;
  Amount: number;
  AvgCostPrice: number;
  Aquisition: number;
  Instrument: Instrument;
  OperationTypeId: number;
  TotalPLInstr: number;
  MarketValueInstr: number;
  RealizedPL: number;
  AquisitionInstr: number;
  InvestPL: number;
  InvestPLInstr: number;
  MWY: number;
  SellAmount: number;
  TurnOverBuy: number;
  TurnOverSell: number;
  YieldYear: number;
}

interface Instrument {
  InstrumentId: number;
  Name: string;
  Ticker?: string;
  Currency?: IDCurrencyDTO;
  Image: { Default: string };
  ClassCode?: string;
}

interface IClient {
  Name: string;
  DU?: number;
  IIS?: number;
}

interface IAccount {
  AccountId: number;
  Name: string;
  DisplayName: string;
  Type: EDAccountMarketType;
}
