import { IDSecurityPayload, Inject, Injectable } from '@invest.wl/core';
import { DSecurityServiceAdapterTid, IDSecurityServiceAdapter } from './D.Security.types';

@Injectable()
export class DSecurityService {
  constructor(
    @Inject(DSecurityServiceAdapterTid) private _service: IDSecurityServiceAdapter,
  ) {}

  public accessRequestAndDataSave(payload: IDSecurityPayload, data: string) {
    return this._service.accessRequestAndDataSave(payload, data);
  }

  public dataGet(payload: IDSecurityPayload) {
    return this._service.dataGet(payload);
  }

  public dataSave(data: string) {
    return this._service.dataSave(data);
  }

  public lock() {
    return this._service.lock();
  }

  public unlock(payload: IDSecurityPayload) {
    return this._service.unlock(payload);
  }

  public check(payload: IDSecurityPayload) {
    return this._service.check(payload);
  }

  public unlockCancel(payload: IDSecurityPayload) {
    return this._service.unlockCancel(payload);
  }

  public accessRequest(payload: IDSecurityPayload) {
    return this._service.accessRequest(payload);
  }

  public accessRevoke(payload: IDSecurityPayload) {
    return this._service.accessRevoke(payload);
  }
}
