import { ITransportWsConnectOpts } from '../S.TransportWs.types';
import { IHelloRequestPayload, IQuoteItemInstrument, ISubscribeRequestPayload } from './model';

export enum ESTransportWsOb2Message {
  HelloReq = 'HelloReq',
  HelloResp = 'HelloResp',

  SubscribeReq = 'SubscribeReq',
  SubscribeResp = 'SubscribeResp',

  UnsubscribeReq = 'UnsubscribeReq',
  UnsubscribeResp = 'UnsubscribeResp',

  QuoteResp = 'QuoteResp',
  ErrorResp = 'ErrorResp',
}

export interface ISTransportWsOb2Request extends Pick<IHelloRequestPayload, 'ProtoVersion'>, ISubscribeRequestPayload {

}

export interface ISTransportWsOb2ConnectOpts extends ITransportWsConnectOpts {
  onUpdate: (list: IQuoteItemInstrument[]) => void; // Callback, вызывается при приходе пакета QuoteResp
}

export interface ISTransportWsOb2DataBase<P = undefined> {
  t: ESTransportWsOb2Message;
  p?: P;
}

export interface ISTransportWsOb2DataOut<P = undefined> extends ISTransportWsOb2DataBase<P> {
  id: string;
}

export interface ISTransportWsOb2DataIn<P = undefined> extends ISTransportWsOb2DataBase<P> {
  id: string;
  // request id
  rid: string;
}
