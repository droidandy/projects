import { EDInstrumentAssetSubType, EDInstrumentAssetType, EDOperationStatus, EDOperationType } from '@invest.wl/core';

export interface IGetNonTradeOperationRequest {
  offset?: number;
  pageSize?: number;
  accounts?: number[] | string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
}

export interface IGetNonTradeOperationResponse extends Array<IGetNonTradeOperationResponseItem> { }

export interface IGetNonTradeOperationResponseItem {
  OperationId: number;
  HumanOperationId: number;
  Instrument: IOperationInstrument;
  Date: Date;
  Type: EDOperationType;
  Amount: number;
  Status: EDOperationStatus;
  AssetType: EDInstrumentAssetType;
  ts: number;
  LinkInstrument: IOperationInstrument;
  SubType: EDInstrumentAssetSubType;
  Description: string;
  Client: IOperationClient;
  Account: IOperationAccount;
  Price: number;
  Comment: string;
}

interface IOperationInstrument {
  Id: number;
  Name: string;
  Ticker: string;
  Image: { Default: string };
}

// interface IOperationAssetType {
//   Id: EDInstrumentAssetType;
//   Name: string;
// }

interface IOperationClient {
  ClientId: number;
  Name: string;
}

interface IOperationAccount {
  AccountId: number;
  Name: string;
}
