import { TDurationISO8601, TModelId } from '../../types';
import { IDInstrumentIdentityPart, IDInstrumentInfoPart } from '../Instrument';
import { EDPortfelTradingState } from '../Portfel';
import { IDInvestIdeaIdentityPart } from './D.InvestIdea.dto';

export interface IDInvestIdeaInfoRequestDTO {
  id: TModelId;
}

export interface IDInvestIdeaInfoResponseDTO extends IDInvestIdeaIdentityPart {
  // TODO: enum?
  Status: number;
  Profit?: number;
  PriceClose?: number;
  PriceOpen?: number;
  Horizon: TDurationISO8601;
  DateOpen?: Date;
  DateCreate?: Date;
  DateClose?: Date;
  RealizeProfit?: number;
  Strategy: string;
  Views: number;
  Instrument?: IDInvestIdeaInstrumentDTO;
  // TODO: placement
  // Placement?: {
  //   PlacementId: number;
  //   DateStart?: Date;
  //   DateEnd?: Date;
  //   Yield?: number;
  //   Description: string;
  // };
}

interface IDInvestIdeaInstrumentDTO extends IDInstrumentIdentityPart, IDInstrumentInfoPart {
  CanOrder: EDPortfelTradingState;
  // TODO: enum
  State: number;
  TimeToOpenTradeSession: TDurationISO8601;
}
