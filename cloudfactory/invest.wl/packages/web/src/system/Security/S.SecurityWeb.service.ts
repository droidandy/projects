import { action, makeObservable } from 'mobx';
import { ISSecurityService, ISSecurityStore, SSecurityStoreTid } from '@invest.wl/system/src/Security/S.Security.types';
import { Inject, Injectable } from '@invest.wl/core/src/di/IoC';
import { ISErrorService, SErrorServiceTid } from '@invest.wl/system/src/Error/S.Error.types';
import { EDSecurityType, IDSecurityPayload } from '@invest.wl/core';

// TODO: сделать возможным писать в защищенное хранилище набор данных, а не только одну строку
@Injectable()
export class SSecurityWebService implements ISSecurityService {
  constructor(
    @Inject(SSecurityStoreTid) private _store: ISSecurityStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) {
    makeObservable(this);
  }

  public async dataGet(payload: IDSecurityPayload) {
    await this.unlock(payload);
    return this.read();
  }

  public async dataSave(data: string) {
    throw this._errorService.securityHandle(new Error('no security store in browser'));
  }

  public async check(payload: IDSecurityPayload): Promise<void> {
    try {
      await this.unlock(payload);
    } catch (e: any) {
      // TODO: check for ISErrorSecurityModel
      if (e.continueCan != null) {
        if (e.isCancelled) throw e;
        else if (e.continueCan && payload.by === EDSecurityType.BIO) return this.check(payload);
        throw e;
      }
      return this.check(payload);
    }
  }

  public async unlock(payload: IDSecurityPayload) {
    try {
      // if (payload.by === EDSecurityBy.BIO) await this._unlockByBiometry(payload.text);
      // else if (payload.by === EDSecurityBy.CODE) await this._native.unlockByCode(payload.text);
      // else throw new Error(`${this.constructor.name}:${__FUNCTION__} - bad type`);
    } catch (e: any) {
      // throw this._errorService.securityHandle(this._handleSystemError(payload, e));
    }
  }

  public async lock() {
    try {
      // await this._native.lock();
    } catch (e: any) {
      throw this._errorService.securityHandle(e);
    }
  }

  public async unlockCancel(payload: IDSecurityPayload) {
    try {
      // if (payload.by === EDSecurityBy.BIO) await this._native.cancelBiometry();
    } catch (e: any) {
      // throw this._errorService.securityHandle(this._handleSystemError(payload, e));
    }
  }

  public async accessRequestAndDataSave(payload: IDSecurityPayload, data: string) {
    await this.accessRequest(payload);
    await this.dataSave(data);
  }

  public async accessRequest(payload: IDSecurityPayload) {
    try {
      // if (payload.by === EDSecurityBy.BIO) await this._native.setUnlockBiometry(payload);
      // else if (payload.by === EDSecurityBy.CODE) await this._native.setUnlockCode(payload.text);
      // else throw new Error(`${this.constructor.name}:${__FUNCTION__} - bad type`);
      await this._store.accessSet(payload.by, true);
    } catch (e: any) {
      throw this._errorService.securityHandle(e);
    }
  }

  @action
  public async accessRevoke(payload: IDSecurityPayload) {
    await this._store.accessSet(payload.by);
    await this.unlockCancel(payload);
  }

  public async clean() {
    try {
      await Promise.all([
        this.accessRevoke({ by: EDSecurityType.BIO, text: '' }),
        this.accessRevoke({ by: EDSecurityType.CODE, text: '' }),
        // this._native.clean(),
      ]);
    } catch (e: any) {
      throw this._errorService.securityHandle(e);
    }
  }

  public async read() {
    try {
      return '';
      // return this._native.read();
    } catch (e: any) {
      throw this._errorService.securityHandle(e);
    }
  }
}
