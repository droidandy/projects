import { TModelId } from '../../types';
import { EDTradeDirection } from '../Trade';
import { EDOrderSource, EDOrderType } from './D.Order.dto';

export interface IDOrderRequestCreateRequestDTO {
  // id = orderId
  id: TModelId;
  accountId: TModelId;
  bs: EDTradeDirection;
  amount: number;
  price: number;
  type: EDOrderType;
  tradeAccountMapId?: TModelId;
  sourceType?: EDOrderSource;
  sourceObjectId?: number;
  instrument: IDOrderRequestInstrument;
}

export interface IDOrderRequestInstrument {
  // id = instrumentId
  id: TModelId;
  secureCode: string;
  classCode: string;
}

export interface IDOrderRequestCreateResponseDTO {
  OrderRequestId: TModelId;
}

