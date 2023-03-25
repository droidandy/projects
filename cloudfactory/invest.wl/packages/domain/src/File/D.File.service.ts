import { IDFileDownloadRequestDTO, IDFileUploadRequestDTO, Inject, Injectable } from '@invest.wl/core';
import { DFileAdapterTid, IDFileAdapter } from './D.File.types';

export const DFileServiceTid = Symbol.for('DFileServiceTid');

@Injectable()
export class DFileService {
  constructor(
    @Inject(DFileAdapterTid) private _adapter: IDFileAdapter,
  ) { }

  public upload(req: IDFileUploadRequestDTO) {
    return this._adapter.upload(req);
  }

  public download(req: IDFileDownloadRequestDTO) {
    return this._adapter.download(req);
  }
}
