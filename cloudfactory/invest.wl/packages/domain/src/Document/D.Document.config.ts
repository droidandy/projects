import { Inject, Injectable } from '../../../core';
import { DDocumentAdapterTid, IDDocumentAdapter, IDDocumentConfig } from './D.Document.types';

@Injectable()
export class DDocumentConfig implements IDDocumentConfig {
  constructor(
    @Inject(DDocumentAdapterTid) protected _adapter: IDDocumentAdapter,
  ) { }

  public get codeLength() {
    return this._adapter.codeLength;
  }

  public get templateMap() {
    return this._adapter.templateMap;
  }

  public get smsResentTimeout() {
    return this._adapter.smsResentTimeout;
  }

  public get createReloadInterval() {
    return this._adapter.createReloadInterval;
  }
}
