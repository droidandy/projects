import { IErrorModel } from '@invest.wl/common';
import { IDErrorBusinessDTO, IDErrorDTO, IDErrorProgDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { DErrorServiceAdapterTid, IDErrorServiceAdapter } from './D.Error.types';
import { DErrorBusinessModel, DErrorBusinessModelTid } from './model/D.ErrorBusiness.model';
import { DErrorProgModel, DErrorProgModelTid } from './model/D.ErrorProg.model';

export const DErrorServiceTid = Symbol.for('DErrorServiceTid');

@Injectable()
export class DErrorService {
  private static _ensure<T extends IDErrorDTO>(error: T | Error | string): T {
    if (typeof error === 'string') return new Error(error) as T;
    return error as T;
  }

  constructor(
    @Inject(DErrorServiceAdapterTid) private _service: IDErrorServiceAdapter,
    @Inject(DErrorBusinessModelTid) private _businessModel: Newable<typeof DErrorBusinessModel>,
    @Inject(DErrorProgModelTid) private _progModel: Newable<typeof DErrorProgModel>,
  ) { }

  public businessHandle = (dto: IDErrorBusinessDTO | string) => {
    const error = new this._businessModel(DErrorService._ensure(dto));
    return this.handle(error);
  };

  public progHandle = (dto: IDErrorProgDTO | string) => {
    const error = new this._progModel(DErrorService._ensure(dto));
    return this.handle(error);
  };

  public handle<E extends IErrorModel>(error: E) {
    if (error instanceof DErrorProgModel) console.log('[ERROR]', error);
    // const isAllowContinueWorkflow = !error.isNeedLockApp;
    // return isAllowContinueWorkflow;
    return this._service.handle(error);
  }
}
