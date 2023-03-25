import { TModelId } from '../../types';
import { EDAccountBoard } from '../Account';
import { IDCurrencyDTO, TDCurrencyCode } from '../Currency/D.Currency.dto';
import { EDInstrumentAssetSubType, EDInstrumentAssetType, IDInstrumentIdentityPart } from '../Instrument';
import { EDPortfelTradingState } from '../Portfel';
import { EDTradeDirection, EDTradeState } from '../Trade';
import { EDOrderStatus, EDOrderType } from './D.Order.dto';

export interface IDOrderListRequestDTO {
  dateFrom?: Date;
  dateTo?: Date;
  currencyName: TDCurrencyCode;
  agreementIdList: TModelId[];
  accountIdList?: TModelId[];
  // TODO: правильно ли?
  statuses?: EDTradeState[];
  instrumentId?: TModelId;
  offset?: number;
  pageSize?: number;
  orderTypeList?: EDOrderType[];
  bs?: EDTradeDirection;
}

export interface IDOrderListResponseDTO extends Array<IDOrderItemDTO> {
}

export interface IDOrderItemDTO {
  // id = orderId
  id: TModelId;
  Instrument: IDOrderInstrumentDTO;
  ExternalId: string;
  Date: Date;
  BS: EDTradeDirection;
  // Кол-во инструмента в заявке
  Amount: number;
  // Кол-во НЕ реализованных активов
  AmountRest: number;
  // Кол-во исполненных активов
  AmountEx: number;
  Price: number;
  Status: EDOrderStatus;
  // TODO: check
  AgreementId: TModelId;
  Account: IDOrderAccountDTO;
  Payment: number;
  Position: number;
  // FIXME: why non in account?
  Board: EDAccountBoard;
  Type: EDOrderType;
  StopPrice: number;
  TakeProfitPrice: number;
}

export interface IDOrderInstrumentDTO extends IDInstrumentIdentityPart {
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
  Currency: IDCurrencyDTO;
  CanOrder: EDPortfelTradingState;
  PriceStep: number;
  DealingCurrency: string;
  PricingCurrency: string;
}

export interface IDOrderAccountDTO {
  name: string;
  id: TModelId;
}
