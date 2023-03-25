import { Inject, Injectable } from '@invest.wl/core';
import merge from 'lodash/merge';
import fetch from 'react-native-cancelable-fetch';
import { ISDeviceStore, SDeviceStoreTid } from '../../Device/S.Device.types';
import { ISErrorService, SErrorServiceTid } from '../../Error/S.Error.types';
import { ESNetworkStatus, ISNetworkConfig, ISNetworkHttpSender, ISNetworkStore, SNetworkConfigTid, SNetworkStoreTid } from '../S.Network.types';
import { toHumanReadableAscii } from '../S.Network.utils';

@Injectable()
export class SNetworkHttpSender implements ISNetworkHttpSender {
  public static textResponseContentType = ['application/octet-stream', 'application/xml'];

  constructor(
    @Inject(SNetworkStoreTid) private _nwStore: ISNetworkStore,
    @Inject(SDeviceStoreTid) private _device: ISDeviceStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
    @Inject(SNetworkConfigTid) private _networkCfg: ISNetworkConfig,
  ) { }

  public async fetch(url: string, opts: RequestInit, reqId: any) {
    const deviceInfo = await this._device.getDeviceInfoAsString();
    opts.headers = merge(opts.headers || {}, {
      'X-Requested-With': toHumanReadableAscii(deviceInfo || ''),
    });

    return fetch(url, opts, reqId).then(this._handleResponse).catch(this._checkError);
  }

  public abort(reqId: any) {
    fetch.abort(reqId);
  }

  private _handleResponse = async (response: Response) => {
    if (!response.ok) throw response;
    let json: any;
    try {
      const contentLengthName = response.headers.has('Content-Length') ? 'Content-Length' : 'content-length';
      const contentTypeName = response.headers.has('Content-Type') ? 'Content-Type' : 'content-type';
      if (SNetworkHttpSender.textResponseContentType.includes(response.headers.get(contentTypeName)!) || response.headers.get(contentLengthName) === '0') {
        // чтение файла (например: xml) в строку
        json = await response.text();
      } else {
        json = await response.json();
      }
      response.json = async () => json;
    } catch (e: any) {
      throw response;
    }

    const isError = !!json?.status ? !this._networkCfg.responseOk.includes(json.status) : false;
    if (isError) throw response;

    this._nwStore.stateSet({ httpStatus: response.status, apiStatus: ESNetworkStatus.OK });
    return response;
  };

  private _checkError = async (response: Response) => {
    let body: any;
    try {
      body = await response.json();
    } catch (e: any) {
      // eat
    }

    const error = this._errorService.httpHandle({
      ...response, body, status: body?.status ?? body?.Status ?? body?.Code ?? body?.error ?? response.status,
      message: body?.message ?? body?.Message ?? body?.error_description, name: 'HttpError',
    });
    this._nwStore.stateSet({
      httpStatus: response.status,
      apiStatus: ESNetworkStatus.ERROR,
      apiError: error,
    });
    throw error;
  };
}
