import { TModelId } from '../../types';
import { EDAccountBoard } from '../Account';
import { IDCurrencyDTO, TDCurrencyCode } from '../Currency/D.Currency.dto';
import { EDInstrumentAssetSubType, EDInstrumentAssetType, IDInstrumentIdentityPart } from '../Instrument';
import { EDPortfelTradingState } from '../Portfel';
import { EDTradeDirection, EDTradeState } from './D.Trade.dto';

export interface IDTradeListRequestDTO {
  dateFrom?: Date;
  dateTo?: Date;
  agreementIdList: TModelId[];
  currencyName: TDCurrencyCode;
  instrumentId?: TModelId;
  isOnlyTrade?: boolean;
  accountIdList?: TModelId[];
  offset?: number;
  pageSize?: number;
}

export interface IDTradeListResponseDTO extends Array<IDTradeItemDTO> {
}

export interface IDTradeItemDTO {
  // id = tradeId
  id: TModelId;
  Instrument: IDTradeInstrumentDTO;
  ExternalId: TModelId;
  Date: Date;
  BS: EDTradeDirection;
  Status: EDTradeState;
  Amount: number;
  Price: number;
  Payment: number;
  AmountRest: number;
  Position: number;
  PriceMoney: number;
  BrokerFee: number;
  Account: IDTradeAccountDTO;
  // TODO: check
  AgreementId: TModelId;
  // FIXME: why non in account?
  Board: EDAccountBoard;
}

export interface IDTradeInstrumentDTO extends IDInstrumentIdentityPart {
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
  CanOrder: EDPortfelTradingState;
  Currency: IDCurrencyDTO;
  PriceStep: number;
  DealingCurrency: string;
  PricingCurrency: string;
}

export interface IDTradeAccountDTO {
  name: string;
}
