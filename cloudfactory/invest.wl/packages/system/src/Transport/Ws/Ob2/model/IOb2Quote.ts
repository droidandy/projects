import { ISTransportWsOb2DataIn } from '../S.TransportWsOb2.types';

export interface IQuoteItemResponsePayload extends Array<IQuoteItemInstrument> {
}

export interface IQuoteItemResponse extends ISTransportWsOb2DataIn<IQuoteItemResponsePayload> {
}

export interface IQuoteItemInstrument extends IQuoteItem {
  i: string;
}

export interface IQuoteItem {
  p: number;
  v: number;
  t: string;
}
