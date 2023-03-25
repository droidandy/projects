import { ISTransportWsOb2DataIn, ISTransportWsOb2DataOut } from '../S.TransportWsOb2.types';

export interface IHelloRequestPayload {
  Token?: string;
  ProtoVersion: number;
}

export interface IHelloRequest extends ISTransportWsOb2DataOut<IHelloRequestPayload> {
}

export interface IHelloResponse extends ISTransportWsOb2DataIn<{ ClientId: number }> {
}
