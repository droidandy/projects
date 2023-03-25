import { TModelId } from '../../types';
import { IDInstrumentId } from './D.Instrument.dto';

export interface IDInstrumentExchangeOptsDTO {
  ttl?: number;
  onUpdate(list: IDInstrumentExchangeItemDTO[]): void;
  onInterrupt?(): void;
}

export interface IDInstrumentExchangeRequestDTO {
  id: IDInstrumentId;
}

export interface IDInstrumentExchangeResponseDTO extends Array<IDInstrumentExchangeItemDTO> {

}

export interface IDInstrumentExchangeItemDTO {
  id: TModelId;
  instrumentId: TModelId;
  price: number;
  volume: number;
  time: string;
}
