import { TModelId } from '@invest.wl/core';
import { ISTransportWsOb2DataIn, ISTransportWsOb2DataOut } from '../S.TransportWsOb2.types';

export interface IUnsubscribeRequestPayload {
  Instruments: TModelId[];
}

export interface IUnsubscribeRequest extends ISTransportWsOb2DataOut<IUnsubscribeRequestPayload> {
}

export interface IUnsubscribeResponse extends ISTransportWsOb2DataIn {
}
