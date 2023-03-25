import { IErrorModel } from '@invest.wl/common';
import { Inject, Injectable, ISErrorDTO, ISErrorHttpDTO, ISErrorSecurityDTO, ISErrorSystemDTO } from '@invest.wl/core';
import { SErrorHttpModel } from './model/S.ErrorHttp.model';
import { SErrorSecurityModel } from './model/S.ErrorSecurity.model';
import { SErrorSystemModel } from './model/S.ErrorSystem.model';
import { SErrorStore } from './S.Error.store';
import { ISErrorService, SErrorStoreTid } from './S.Error.types';

@Injectable()
export class SErrorService implements ISErrorService {
  private static _ensure<T extends ISErrorDTO>(error: T | Error | string): T {
    if (typeof error === 'string') return new Error(error) as T;
    return error as T;
  }

  constructor(
    @Inject(SErrorStoreTid) private _store: SErrorStore,
  ) { }

  public httpHandle = (dto: ISErrorHttpDTO | SErrorHttpModel) => {
    const error = dto instanceof SErrorHttpModel ? dto : new SErrorHttpModel(SErrorService._ensure(dto));
    // if (error.IsAccess) error.IsNeedNotification = false;
    // if (error.IsAccess && activeRoute !== AuthType) {
    //   error.IsNeedLockApp = true;
    //   error.IsNotified = true;
    // }
    return this.handle(error);
  };

  public systemHandle = (dto: ISErrorSystemDTO | string) => {
    const error = new SErrorSystemModel(SErrorService._ensure(dto));
    return this.handle(error);
  };

  public securityHandle = (dto: ISErrorSecurityDTO) => {
    const error = new SErrorSecurityModel(dto);
    return this.handle(error);
  };

  public handle<E extends IErrorModel>(error: E) {
    if (error instanceof SErrorSystemModel && __DEV__) console.log('[ERROR]', error);
    this._store.add(error);
    // const isAllowContinueWorkflow = !error.isNeedLockApp;
    // return isAllowContinueWorkflow;
    return error;
  }
}
