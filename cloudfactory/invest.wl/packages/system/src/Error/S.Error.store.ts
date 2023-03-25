import { EventX, IErrorModel } from '@invest.wl/common';
import { IErrorExceptionDTO, Injectable } from '@invest.wl/core';
import { ISErrorStore } from './S.Error.types';

@Injectable()
export class SErrorStore implements ISErrorStore {
  private static _timeoutBeforeEqualMessage = 1000;

  public errorX = new EventX<IErrorModel>();
  public exceptionX = new EventX<IErrorExceptionDTO>();
  private _equalMessageTimeout?: NodeJS.Timeout = undefined;

  public async init() {
    // stub
  }

  public add(e: IErrorModel) {
    // нужно дождаться пока ошибка обработается всеми catch'ами
    // чтобы было время подменить сообщение
    setTimeout(() => {
      if (this.errorX.value?.message === e.message && this._equalMessageTimeout != null) return;
      this._equalMessageTimeout = setTimeout(() => (this._equalMessageTimeout = undefined), SErrorStore._timeoutBeforeEqualMessage);
      this.errorX.emit(e);
    });
  }

  public addException(exception: IErrorExceptionDTO) {
    this.exceptionX.emit(exception);
  }
}
