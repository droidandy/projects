import { TModelId } from '../../types';
import { EDInstrumentAssetSubType, EDInstrumentAssetType, IDInstrumentId } from '../Instrument';
import { EDTradeDirection } from '../Trade';
import { EDOrderStatus, EDOrderType } from './D.Order.dto';

export interface IDOrderInfoRequestDTO {
  // id = orderId
  id: TModelId;
}

export interface IDOrderInfoResponseDTO {
  // id = orderId
  id: TModelId;
  Instrument: IDOrderInfoInstrumentDTO;
  AccountId: TModelId;
  ExternalId: string;
  OrderDate: Date;
  BS: EDTradeDirection;
  ExchangeStatus: EDOrderStatus;
  Price: number;
  Amount: number;
  AmountRest: number;
  AmountOnDelete: number;
  AmountLot: number;
  ExpirationDate: Date;
  Type: EDOrderType;
  StopPrice: number;
  TakeProfitPrice: number;
  OffsetPoint: number;
  DiscretionOffset: number;
  Comment: string;
  Error: string;
  Moment: Date;
  IsOpenByRule: boolean;
  TradeAccountMapId: TModelId;
  Payment: number;
  TimeInForce: string;
}

export interface IDOrderInfoInstrumentDTO {
  // Id = InstrumentId
  id: IDInstrumentId;
  SecureCode: string;
  ClassCode: string;
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
}
