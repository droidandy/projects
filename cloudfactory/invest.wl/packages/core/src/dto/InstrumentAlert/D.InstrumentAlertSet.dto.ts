import { TModelId } from '../../types';

export interface IDInstrumentAlertSetRequestDTO {
  // id = alertId
  id: TModelId;
  instrumentId: TModelId;
  classCode: string;
  secureCode: string;
  targetPrice: number;
}

export interface IDInstrumentAlertSetResponseDTO {
  AlertId: TModelId;
}
