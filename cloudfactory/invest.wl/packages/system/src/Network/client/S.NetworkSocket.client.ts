import { Inject, Injectable } from '@invest.wl/core';
import { ISNetworkSocketClient, ISNetworkSocketInterrupt, ISNetworkSocketMessage, SNetworkSocketSenderTid } from '../S.Network.types';
import { SNetworkSocketSender } from './S.NetworkSocket.sender';

@Injectable()
export class SNetworkSocketClient implements ISNetworkSocketClient {
  private static _state = {
    NOT_FOUND: -1,
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
  }; // Состояние сокет клиента

  constructor(
    @Inject(SNetworkSocketSenderTid) private _socket: SNetworkSocketSender,
  ) { }

  public async connect(url: string) {
    if (this.isOpened) return;
    return this._connect(url);
  };

  public disconnect(code?: number, reason?: string): Promise<void> {
    this._clearCallback();

    if (this.isClosed) return Promise.resolve();
    this._socket.close();

    return new Promise((resolve, reject) => {
      if (this.isClosed) resolve();
      else reject();
    });
  }

  public send = (data: any) => {
    if (this.isOpened) this._socket.send(data);
  };

  public onInterrupt = (callback: (e: ISNetworkSocketInterrupt) => void) => {
    this._socket.onclose = callback;
  };

  public onMessage = (callback: (e: ISNetworkSocketMessage) => void) => {
    this._socket.onmessage = callback;
  };

  public get isOpened() {
    return this._socket.readyState === SNetworkSocketClient._state.OPEN;
  }

  public get isClosed() {
    return this._socket.readyState === SNetworkSocketClient._state.NOT_FOUND ||
      this._socket.readyState === SNetworkSocketClient._state.CLOSED ||
      this._socket.readyState === SNetworkSocketClient._state.CLOSING;
  }

  private async _connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._socket.open(url);
      this._socket.onopen = () => {
        this._clearCallback();
        resolve();
      };
      this._socket.onerror = (err) => {
        this._clearCallback();
        this._socket.close();
        reject(err);
      };
    });
  };

  private _clearCallback = () => {
    this._socket.onopen = null;
    this._socket.onerror = null;
    this._socket.onclose = null;
    this._socket.onmessage = null;
  };
}
