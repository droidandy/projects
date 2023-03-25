import { TDurationISO8601, TModelId } from '../../types';
import { IDImageSized } from '../Image/D.Image.dto';
import { EDInstrumentTradeState, IDInstrumentIdentityPart, IDInstrumentInfoPart } from '../Instrument';
import { EDPortfelTradingState } from '../Portfel';
import { EDNewsRubrick, EDNewsStatus } from './D.News.dto';

export interface IDNewsInfoRequestDTO {
  id: TModelId;
}

export interface IDNewsInfoResponseDTO {
  // id = newsId
  id: TModelId;
  Instrument?: IDNewsInfoInstrumentDTO;
  Title: string;
  Body: string;
  PDF: string;
  Rubric: EDNewsRubrick;
  Link: string;
  // TODO: ask image of Instrument or News?
  Image: IDImageSized;
  Status?: EDNewsStatus;
  SourceName: string;
  Date: Date;
  Views: number;
}

export interface IDNewsInfoInstrumentDTO extends IDInstrumentIdentityPart, IDInstrumentInfoPart {
  CanOrder?: EDPortfelTradingState;
  State: EDInstrumentTradeState;
  TimeToOpenTradeSession: TDurationISO8601;
}
