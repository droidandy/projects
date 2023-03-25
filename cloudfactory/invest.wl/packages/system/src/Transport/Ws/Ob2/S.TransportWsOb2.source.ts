import { numberIsZero } from '@invest.wl/common';
import { Injectable, IoC, TModelId } from '@invest.wl/core';
import throttle from 'lodash/throttle';
import { SAuthStore } from '../../../Auth/S.Auth.store';
import { SAuthStoreTid } from '../../../Auth/S.Auth.types';
import { ISNetworkSocketQueue } from '../../../Network/client/S.NetworkSocket.queue';
import {
  ISNetworkEndpointProvider,
  ISNetworkSocketClient,
  ISNetworkSocketInterrupt,
  ISNetworkSocketMessage,
  SNetworkEndpointProviderTid,
  SNetworkSocketClientTid,
  SNetworkSocketQueueTid,
} from '../../../Network/S.Network.types';
import { ISTransportWsSource } from '../S.TransportWs.types';
import {
  IHelloRequest,
  IHelloRequestPayload,
  IHelloResponse,
  IQuoteItemInstrument,
  IQuoteItemResponse,
  IQuoteResponseItem,
  ISubscribeRequest,
  ISubscribeRequestPayload,
  ISubscribeResponse,
  IUnsubscribeRequest,
  IUnsubscribeRequestPayload,
  IUnsubscribeResponse,
} from './model';
import { ESTransportWsOb2Message, ISTransportWsOb2ConnectOpts, ISTransportWsOb2Request } from './S.TransportWsOb2.types';

export const STransportWsOb2SourceTid = Symbol.for('STransportWsOb2SourceTid');

@Injectable()
export class STransportWsOb2Source implements ISTransportWsSource<ISTransportWsOb2Request, IQuoteItemInstrument[]> {
  private static _reqId = 0;

  private static _reqIdNext() {
    return (STransportWsOb2Source._reqId++).toString();
  }

  private _isSubscribed = false;

  private _socketClient = IoC.get<ISNetworkSocketClient>(SNetworkSocketClientTid);
  private _epPrv = IoC.get<ISNetworkEndpointProvider>(SNetworkEndpointProviderTid);
  private _authStore = IoC.get<SAuthStore>(SAuthStoreTid);
  private _queue = IoC.get<ISNetworkSocketQueue>(SNetworkSocketQueueTid);

  private _ep = this._epPrv.provide('29d98f1e');
  private _instruments?: TModelId[];

  constructor(private _options: ISTransportWsOb2ConnectOpts) {
    this._queue.init(this._options);
  }

  public async request(props: ISTransportWsOb2Request) {
    if (this._isSubscribed && this._instruments) await this.Unsubscribe({ Instruments: this._instruments });
    if (!this._socketClient.isOpened) await this.connect();
    this._instruments = props.Instruments;
    await this.Hello({ ProtoVersion: props.ProtoVersion });
    const response = await this.Subscribe({ Instruments: props.Instruments });
    return this._subscribeResponseHandle(response.p?.ob);
  }

  public async dispose() {
    if (this._instruments) {
      try {
        if (this._isSubscribed) {
          this._isSubscribed = false;
          await this.Unsubscribe({ Instruments: this._instruments });
        }
      } catch (e: any) {
        // eat
      }
      this._instruments = undefined;
    }
    await this.disconnect();
  }

  public async connect() {
    await this._socketClient.connect(this._ep.url);
    this._socketClient.onMessage(this._onMessage);
    this._socketClient.onInterrupt(this._onInterrupt);
  };

  public disconnect() {
    return this._socketClient.disconnect();
  }

  public Hello = (p: IHelloRequestPayload): Promise<IHelloResponse> =>
    this._send({
      id: STransportWsOb2Source._reqIdNext(), t: ESTransportWsOb2Message.HelloReq,
      p: { ...p, Token: this._authStore.token },
    });
  public Subscribe = (p: ISubscribeRequestPayload): Promise<ISubscribeResponse> => {
    return this._send<ISubscribeResponse>({
      id: STransportWsOb2Source._reqIdNext(), t: ESTransportWsOb2Message.SubscribeReq, p,
    }).then(res => {
      this._isSubscribed = true;
      return res;
    });
  };
  public Unsubscribe = (p: IUnsubscribeRequestPayload): Promise<IUnsubscribeResponse> =>
    this._send<IUnsubscribeResponse>({
      id: STransportWsOb2Source._reqIdNext(), t: ESTransportWsOb2Message.UnsubscribeReq, p,
    }).then(res => {
      this._isSubscribed = false;
      return res;
    });

  private _send<Resp>(data: IHelloRequest | ISubscribeRequest | IUnsubscribeRequest): Promise<Resp> {
    this._socketClient.send(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this._queue.add(data.id, { resolve, reject });
    });
  }

  private _onMessage = (event: ISNetworkSocketMessage) => {
    try {
      const data = JSON.parse(event.data);
      const queueItem = this._queue.map[data.rid];

      if (data.rid && !!queueItem) {
        switch (data.t) {
          case ESTransportWsOb2Message.ErrorResp:
            queueItem.callbacks.reject(data);
            break;
          case ESTransportWsOb2Message.HelloResp:
          case ESTransportWsOb2Message.SubscribeResp:
          case ESTransportWsOb2Message.UnsubscribeResp:
            queueItem.callbacks.resolve(data);
            break;
          default:
            throw new Error('Message type not found');
        }
        delete this._queue.map[data.rid];
      } else if (data.t === ESTransportWsOb2Message.QuoteResp) {
        this._onQuoteResp(data);
      }
    } catch (e: any) {
      console.log(e, event);
    }
  };

  private _onInterrupt = (event: ISNetworkSocketInterrupt) => {
    this._queue.clear(`Socket error code: ${event.code}`);
    this._options?.onInterrupt?.(event);
  };

  private _subscribeResponseHandle(list?: IQuoteResponseItem[]): IQuoteItemInstrument[] {
    const result: IQuoteItemInstrument[] = [];
    if (!list) return result;
    list.forEach(item => {
      item.bid?.forEach((i) => {
        if (!numberIsZero(i.v)) result.push({ i: item.i, ...i });
      });
      item.ask?.forEach((i) => {
        if (!numberIsZero(i.v)) result.push({ i: item.i, ...i });
      });
    });
    return result;
  }

  private _onQuoteResp = throttle((data: IQuoteItemResponse) => {
    if (!this._isSubscribed || !data.p) return;
    this._options?.onUpdate(data.p);
  }, 20);
}
