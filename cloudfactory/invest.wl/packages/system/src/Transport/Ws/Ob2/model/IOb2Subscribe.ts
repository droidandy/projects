import { TModelId } from '@invest.wl/core';
import { ISTransportWsOb2DataIn, ISTransportWsOb2DataOut } from '../S.TransportWsOb2.types';
import { IQuoteItem } from './IOb2Quote';

export interface ISubscribeRequestPayload {
  // id вида `<instrument.secureCode>@<instrument.classCode>`
  Instruments: TModelId[];
}

export interface ISubscribeRequest extends ISTransportWsOb2DataOut<ISubscribeRequestPayload> {
}

export interface ISubscribeResponse extends ISTransportWsOb2DataIn<{ ob: IQuoteResponseItem[] }> {
}

export interface IQuoteResponseItem {
  i: string;
  bid?: IQuoteItem[];
  ask?: IQuoteItem[];
}
