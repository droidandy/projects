// @ts-ignore
import { ISecurityV2, RNSecurityError, RNSecurityErrorEnum, SecurityV2 } from 'react-native-security';
import { EDSecurityType, IDSecurityPayload, Inject, Injectable } from '@invest.wl/core';
import { ISErrorService, ISSecurityService, ISSecurityStore, SErrorSecurityModel, SErrorServiceTid, SSecurityStoreTid } from '@invest.wl/system';

// TODO: сделать возможным писать в защищенное хранилище набор данных, а не только одну строку
@Injectable()
export class SSecurityMobileService implements ISSecurityService {
  private _native: ISecurityV2 = new SecurityV2();

  constructor(
    @Inject(SSecurityStoreTid) private _store: ISSecurityStore,
    @Inject(SErrorServiceTid) private _errorService: ISErrorService,
  ) { }

  public async init() {
    if (!this._store.unlockCan) await this._native.clean();
  }

  public async dataGet(payload: IDSecurityPayload) {
    await this.unlock(payload);
    return this.read();
  }

  public async dataSave(data: string) {
    try {
      await this._native.save(data);
    } catch (e: any) {
      throw this._errorService.securityHandle(e);
    }
  }

  public async check(payload: IDSecurityPayload): Promise<void> {
    try {
      await this.unlock(payload);
    } catch (e: any) {
      if (e instanceof SErrorSecurityModel) {
        if (e.isCancelled) throw e;
        else if (e.continueCan && payload.by === EDSecurityType.BIO) return this.check(payload);
        throw e;
      }
      return this.check(payload);
    }
  }

  public async unlock(payload: IDSecurityPayload) {
    try {
      if (payload.by === EDSecurityType.BIO) await this._unlockByBiometry(payload.text);
      else if (payload.by === EDSecurityType.CODE) await this._native.unlockByCode(payload.text);
      else throw this._errorService.systemHandle(`${this.constructor.name}:${__FUNCTION__} - bad type`);
      this._store.lockedSet(false);
    } catch (e: any) {
      throw this._errorService.securityHandle(this._handleSystemError(payload, e));
    }
  }

  public async lock() {
    try {
      await this._native.lock();
      this._store.lockedSet(true);
    } catch (e: any) {
      throw this._errorService.securityHandle(e);
    }
  }

  public async unlockCancel(payload: IDSecurityPayload) {
    try {
      if (payload.by === EDSecurityType.BIO) await this._native.cancelBiometry();
    } catch (e: any) {
      throw this._errorService.securityHandle(this._handleSystemError(payload, e));
    }
  }

  public async accessRequestAndDataSave(payload: IDSecurityPayload, data: string) {
    await this.accessRequest(payload);
    await this.dataSave(data);
  }

  public async accessRequest(payload: IDSecurityPayload) {
    try {
      if (payload.by === EDSecurityType.BIO) await this._native.setUnlockBiometry(payload);
      else if (payload.by === EDSecurityType.CODE) await this._native.setUnlockCode(payload.text);
      else throw this._errorService.systemHandle(`${this.constructor.name}:${__FUNCTION__} - bad type`);

      await this._store.accessSet(payload.by, true);
    } catch (e: any) {
      throw this._errorService.securityHandle(e);
    }
  }

  public async accessRevoke(payload: IDSecurityPayload) {
    await this._store.accessSet(payload.by);
    await this.unlockCancel(payload);
  }

  public async clean() {
    try {
      await Promise.all([
        this.accessRevoke({ by: EDSecurityType.BIO, text: '' }),
        this.accessRevoke({ by: EDSecurityType.CODE, text: '' }),
        this._native.clean(),
      ]);
    } catch (e: any) {
      throw this._errorService.securityHandle(e);
    }
  }

  public read() {
    try {
      return this._native.read();
    } catch (e: any) {
      throw this._errorService.securityHandle(e);
    }
  }

  private async _unlockByBiometry(text?: string) {
    await this._native.cancelBiometry();
    await this._native.unlockByBiometry(text ? { text } : undefined);
  }

  private _handleSystemError(payload: IDSecurityPayload, error: RNSecurityError) {
    if (payload.by === EDSecurityType.BIO) return this._handleSystemBioError(error);
    else if (payload.by === EDSecurityType.CODE) return this._handleSystemCodeError(error);
    return error;
  }

  private _handleSystemBioError(error: RNSecurityError) {
    console.log('BIO ERROR: ', error); // 🐞 ✅
    switch (error.code) {
      case RNSecurityErrorEnum.CANT_GET_LOGIN_PASSWORD:
        // Only for IOS
        error.subCode = this._store.biometryType;
        break;
      case RNSecurityErrorEnum.FINGERPRINT_BUSY:
        // this.cancelBiometry();
        break;

      case RNSecurityErrorEnum.FINGERPRINT_TO_MUCH_ATTEMPTS:
      case RNSecurityErrorEnum.FINGERPRINT_NOT_SUPPORTED:
      case RNSecurityErrorEnum.NO_TOUCHID_FINGERS:
      case RNSecurityErrorEnum.NO_TOUCHID_FINGERS2:
        this._native.cancelBiometry().then();
        break;
    }

    // if (error.Code === RNSecurityErrorEnum.BIOMETRY_CANCELLED) {
    //   appError.IsNeedNotification = false;
    // }

    return error;
  };

  private _handleSystemCodeError(error: RNSecurityError) {
    console.log('CODE ERROR: ', error); // 🐞 ✅
    return error;
  }
}
