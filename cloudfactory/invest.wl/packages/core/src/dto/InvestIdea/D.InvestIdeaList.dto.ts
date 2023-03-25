import { IDSortResult, TDurationISO8601, TModelId } from '../../types';
import { TDCurrencyCode } from '../Currency/D.Currency.dto';
import { IDImageSized } from '../Image/D.Image.dto';
import { IDInstrumentIdentityPart, IDInstrumentInfoPart } from '../Instrument';
import { EDPortfelTradingState } from '../Portfel';
import { EDInvestIdeaInstrumentType, EDInvestIdeaType } from './D.InvestIdea.dto';

export type IDInvestIdeaListSort = Pick<IDInvestIdeaItemDTO, 'Date' | 'Profit'>;

export interface IDInvestIdeaListRequestDTO {
  type?: EDInvestIdeaInstrumentType;
  instrumentId?: TModelId;
  currencies?: TDCurrencyCode[];
  order?: IDSortResult<IDInvestIdeaListSort>;
  pageSize?: number;
  offset?: number;
  // TODO:
  // riskProfileMode?: RiskProfileModeEnum;
}

export interface IDInvestIdeaListResponseDTO extends Array<IDInvestIdeaItemDTO> {

}

export interface IDInvestIdeaItemDTO {
  // id = investIdeaId
  id: TModelId;
  Title: string;
  // TODO: enum?
  Status: number;
  IdeaType: EDInvestIdeaType;
  Profit?: number;
  PriceClose?: number;
  PriceOpen?: number;
  Horizon: TDurationISO8601;
  DateOpen?: Date;
  Date?: Date;
  DateCreate?: Date;
  Image: IDImageSized;
  DateClose?: Date;
  RealizeProfit?: number;
  Strategy: string;
  Views: number;
  Instrument?: IDInvestIdeaInstrumentDTO;
  // TODO: placement
  Placement?: IDInvestIdeaPlacementDTO;
}

interface IDInvestIdeaInstrumentDTO extends IDInstrumentIdentityPart, IDInstrumentInfoPart {
  CanOrder: EDPortfelTradingState;
  // TODO: enum
  State: number;
  TimeToOpenTradeSession: TDurationISO8601;
}

export interface IDInvestIdeaPlacementDTO {
  id: TModelId;
  DateStart?: Date;
  DateEnd?: Date;
  Yield?: number;
  Description: string;
}