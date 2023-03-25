import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ISErrorHttpModel } from '../Error/S.Error.types';

export const SNetworkSocketQueueTid = Symbol.for('SNetworkSocketQueueTid');
export const SNetworkStoreTid = Symbol.for('SNetworkStoreTid');
export const SNetworkHttpClientTid = Symbol.for('SNetworkHttpClientTid');
export const SNetworkSocketClientTid = Symbol.for('SNetworkSocketClientTid');
export const SNetworkConfigTid = Symbol.for('SNetworkConfigTid');
export const SNetworkEndpointProviderTid = Symbol.for('SNetworkEndpointProviderTid');
export const SNetworkEndpointConfiguratorTid = Symbol.for('SNetworkEndpointConfiguratorTid');
export const SNetworkSocketSenderTid = Symbol.for('SNetworkSocketSenderTid');
export const SNetworkHttpSenderTid = Symbol.for('SNetworkHttpTid');
export const SNetworkAccessRefreshServiceTid = Symbol.for('SNetworkAccessRefreshServiceTid');

export type TUrlLv = () => string | Promise<string>;

export enum ESNetworkHttpMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface ISNetworkHttpEndpoint {
  url: string;
  method: ESNetworkHttpMethod;
}

export enum ESNetworkTokenMode {
  QueryString = 'QueryString',
  Header = 'Header',
}

export enum ESNetworkStatus {
  ERROR = 'ERROR',
  OK = 'OK',
}

export interface ISNetworkState {
  httpStatus: number;
  apiStatus: ESNetworkStatus;
  apiError?: ISErrorHttpModel;
}

export interface ISNetworkStore {
  readonly state: ISNetworkState;
  readonly isUnauthorized: boolean;
  readonly isAccess: boolean;
  readonly isNetwork: boolean;
  stateSet(state: ISNetworkState): void;
}

export interface ICancellablePromise<T> extends Promise<T> {
  cancel(): void;
  then<TResult1 = T, TResult2 = never>(
    resolve?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    reject?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): ICancellablePromise<TResult1 | TResult2>;
  catch<TResult = never>(reject?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): ICancellablePromise<T | TResult>;
}

// HTTP
export interface ISNetworkHttpSender {
  tokenMode?: ESNetworkTokenMode;
  fetch<Res = any>(url: string, config: AxiosRequestConfig, token?: string, reqId?: any): Promise<AxiosResponse<Res>>;
  abort(reqId: any): void;
}

export interface ISNetworkHttpClient {
  tokenMode?: ESNetworkTokenMode;
  request<Req, Resp>(endPoint: ISNetworkHttpEndpoint, req: Req, token?: string, options?: AxiosRequestConfig): ICancellablePromise<Resp>;
}

export interface ISNetworkSocketSender {
  readonly readyState: number;
  onclose: ((ev: CloseEvent) => any) | null;
  onerror: ((ev: Event) => any) | null;
  onmessage: ((ev: MessageEvent) => any) | null;
  onopen: ((ev: Event) => any) | null;

  open(url: string): void;
  close(code?: number, reason?: string): void;
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
}

// Socket
export interface ISNetworkSocketClient {
  readonly isOpened: boolean;
  readonly isClosed: boolean;
  onInterrupt(callback: (ev: ISNetworkSocketInterrupt) => void): void;
  onMessage(callback: (ev: ISNetworkSocketMessage) => void): void;

  connect(url: string): Promise<void>;
  disconnect(): Promise<void>;
  send(data: any): void;
}

export interface ISNetworkSocketInterrupt {
  readonly code: number;
}

export interface ISNetworkSocketMessage {
  readonly data: any;
}

// Endpoint
export interface ISNetworkEndpointProvider {
  readonly isConfigured: boolean;
  provide(uid: string): ISNetworkHttpEndpoint;
}

export interface ISNetworkEndpointConfigurator {
  configure(map: ISNetworkEndpointMap): void;
}

export interface ISNetworkEndpointMap {
  [id: string]: ISNetworkHttpEndpoint;
}

export interface ISNetworkConfig {
  readonly tokenMode: ESNetworkTokenMode;
  readonly tokenPrefix?: string;
  readonly responseOk: (string | number)[];
}
