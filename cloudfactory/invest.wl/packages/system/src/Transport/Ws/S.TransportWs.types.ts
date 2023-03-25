import { ISNetworkSocketInterrupt } from '../../Network/S.Network.types';

export interface ITransportWsConnectOpts {
  ttl: number; // Время протухания запроса в миллисекундах
  onInterrupt?: (event: ISNetworkSocketInterrupt) => void; // Callback, вызывается при обрыве соединения
}

export interface ISTransportWsSource<Req, Res> {
  request(req: Req): Promise<Res>;
  connect(): void;
  disconnect(): void;
  dispose(): void;
}
