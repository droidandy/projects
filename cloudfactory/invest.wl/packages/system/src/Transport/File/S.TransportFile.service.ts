import { Inject, Injectable } from '@invest.wl/core';
import { v4 as uuidv4 } from 'uuid';
import { ISAuthStore, SAuthStoreTid } from '../../Auth/S.Auth.types';
import { ISErrorService, SErrorServiceTid } from '../../Error/S.Error.types';
import { SNetworkStore } from '../../Network/S.Network.store';
import {
  ESNetworkStatus,
  ISNetworkConfig,
  ISNetworkEndpointProvider,
  SNetworkConfigTid,
  SNetworkEndpointProviderTid,
  SNetworkStoreTid,
} from '../../Network/S.Network.types';
import { IFileResponse, IFileUploadRequest } from './model';

export const STransportFileServiceTid = Symbol.for('STransportFileServiceTid');

@Injectable()
export class STransportFileService {
  constructor(
    @Inject(SNetworkStoreTid) private _networkStore: SNetworkStore,
    @Inject(SNetworkConfigTid) private _networkCfg: ISNetworkConfig,
    @Inject(SNetworkEndpointProviderTid) private _epPrv: ISNetworkEndpointProvider,
    @Inject(SAuthStoreTid) private _authStore: ISAuthStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) { }

  // TODO: make it
  public async Upload(req: IFileUploadRequest): Promise<IFileResponse> {
    // const fileType = req.file.name.split('.').pop();
    // if (!this._const.uploadFormats.includes(fileType)) {
    //   this._notification.errorAdd(`Выбранный тип файла недоступен для загрузки. Доступные типы: ${this._const.uploadFormats.join(', ')}`);
    //   return;
    // }

    const upid = uuidv4();
    const ep = await this._epPrv.provide('UFile');
    // const url = this._cfg.uStoreLink + ep.url;
    const url = ep.url;
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this._authStore.token}`);
    headers.append('Content-Type', 'multipart/form-data');

    const formData = new FormData();
    formData.append('upid', upid);
    formData.append('description', req.file.name);
    formData.append('submit', req.file as unknown as Blob);

    const options: RequestInit = {
      headers,
      body: formData,
      method: ep.method,
    };

    try {
      const response = await fetch(url, options);
      const text = await response.text?.();
      response.text = async () => text as string;
      if (!this._networkCfg.responseOk.includes(text)) throw response;
      this._networkStore.stateSet({ httpStatus: response.status, apiStatus: ESNetworkStatus.OK });
      return { upid };
    } catch (err: any) {
      // err.message = DocumentPicker.isCancel(err) ? 'Файл не выбран' : `Ошибка загрузки файла. ${err.message || ''}`;
      const apiError = this._errorService.httpHandle(err);
      this._networkStore.stateSet({
        httpStatus: err.status,
        apiStatus: ESNetworkStatus.ERROR,
        apiError,
      });
      throw apiError;
    }
  }
}
