import { EDAccountMarketType, EDInstrumentAssetSubType, EDInstrumentAssetType } from '@invest.wl/core';

export interface IGetPortfelPLByInstrumentRequest {
  dateFrom: Date | string;
  dateTo: Date | string;
  clients: number[] | string;
  assetType?: number;
  currencyName?: string;
  instrumentId?: number;
  accounts?: number[] | string;
}

export interface IGetPortfelPLByInstrumentResponse extends Array<IGetPortfelPLByInstrumentResponseItem> { }

export interface IGetPortfelPLByInstrumentResponseItem {
  AssetType?: EDInstrumentAssetType;
  AssetSubType?: EDInstrumentAssetSubType;
  MarketValue?: number;
  TotalPL?: number;
  Yield?: number;
  Amount?: number;
  AvgCostPrice?: number;
  Aquisition?: number;
  Instrument?: {
    InstrumentId?: number;
    Name?: string;
    Ticker?: string;
    Currency?: {
      Name: string;
    };
    Image: {
      Default: string;
    };
    ClassCode?: string;
  };
  OperationTypeId?: number;
  TotalPLInstr?: number;
  MarketValueInstr?: number;
  Account: {
    AccountId: number;
    Name: string;
    DisplayName: string;
    Type: EDAccountMarketType;
  };
  Client: {
    Name: string;
  };
  AquisitionInstr?: number;
}
