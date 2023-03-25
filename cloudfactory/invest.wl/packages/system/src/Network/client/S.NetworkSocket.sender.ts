import { Injectable } from '@invest.wl/core';
import { ISNetworkSocketSender } from '../S.Network.types';

@Injectable()
export class SNetworkSocketSender implements ISNetworkSocketSender {
  private _ws?: WebSocket;

  public get readyState() {
    return this._ws ? this._ws.readyState : -1;
  }

  public get onclose() {
    if (!this._ws) return null;
    return this._ws.onclose;
  }

  public set onclose(v: ((ev: CloseEvent) => any) | null) {
    if (!this._ws) return;
    this._ws.onclose = v;
  }

  public get onerror() {
    if (!this._ws) return null;
    return this._ws.onerror;
  }

  public set onerror(v: ((ev: Event) => any) | null) {
    if (!this._ws) return;
    this._ws.onerror = v;
  }

  public get onmessage() {
    if (!this._ws) return null;
    return this._ws.onmessage;
  }

  public set onmessage(v: ((event: MessageEvent) => void) | null) {
    if (!this._ws) return;
    this._ws.onmessage = v;
  }

  public get onopen() {
    if (!this._ws) return null;
    return this._ws.onopen;
  }

  public set onopen(v: ((ev: Event) => any) | null) {
    if (!this._ws) return;
    this._ws.onopen = v;
  }

  public open(url: string) {
    this._ws = new WebSocket(url);
  }

  public close(code?: number, reason?: string) {
    if (!this._ws) return;
    this._ws.close();
    this._ws = undefined;
  }

  public send(data: string | ArrayBuffer | Blob | ArrayBufferView): void {
    if (!this._ws) throw new Error('WebSocket not opened.');
    this._ws.send(data);
  }
}
