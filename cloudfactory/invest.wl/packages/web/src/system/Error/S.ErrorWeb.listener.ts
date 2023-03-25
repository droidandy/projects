import { Inject, Injectable } from '@invest.wl/core';
import { ISErrorStore, SErrorStoreTid } from '@invest.wl/system/src/Error/S.Error.types';
import { IErrorExceptionDTO } from '@invest.wl/core/src/dto/Error/Error.dto';

@Injectable()
export class SErrorWebListener {
  private static _map = {
    [TypeError.name]: TypeError,
    [Error.name]: Error,
    [ReferenceError.name]: ReferenceError,
    [SyntaxError.name]: SyntaxError,
    [EvalError.name]: EvalError,
  };

  constructor(
    @Inject(SErrorStoreTid) private _store: ISErrorStore,
  ) {}

  public init() {
    window.addEventListener('unhandledrejection', (event) => {
      // this._handler(event.reason as string, false);
    });
    window.addEventListener('error', (e) => {
      this._handler({ ...e, name: 'Error' }, false);
      return false;
    });
  }

  private _handler = (error: string | IErrorExceptionDTO, isFatal: boolean) => {
    if (typeof error === 'string') {
      const matched = error.match(/^(\w+):([^\n]+)\n([\s\S]+)/);
      if (matched) {
        const ctor = SErrorWebListener._map[matched[1]] || Error;
        error = new ctor(matched[2]);
        error.stack = matched[3];
      } else {
        error = new Error(error);
      }
    }
    error.isFatal = isFatal;
    this._store.addException(error);
  };
}
