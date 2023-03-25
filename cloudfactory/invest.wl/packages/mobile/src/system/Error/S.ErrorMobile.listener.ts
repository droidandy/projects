import { ErrorModel } from '@invest.wl/common';
import { IErrorExceptionDTO, Inject, Injectable } from '@invest.wl/core';
import { ISErrorStore, SErrorStoreTid } from '@invest.wl/system';
import { setJSExceptionHandler } from 'react-native-exception-handler';

@Injectable()
export class SErrorMobileListener {
  private static _map = {
    [TypeError.name]: TypeError,
    [Error.name]: Error,
    [ReferenceError.name]: ReferenceError,
    [SyntaxError.name]: SyntaxError,
    [EvalError.name]: EvalError,
  };

  constructor(
    @Inject(SErrorStoreTid) private _store: ISErrorStore,
  ) { }

  public init() {
    setJSExceptionHandler(this._handler, true);
  }

  private _handler = (error: string | IErrorExceptionDTO | ErrorModel, isFatal: boolean) => {
    if (typeof error === 'string') {
      const matched = error.match(/^(\w+):([^\n]+)\n([\s\S]+)/);
      if (matched) {
        const ctor = SErrorMobileListener._map[matched[1]] || Error;
        error = new ctor(matched[2]);
        error.stack = matched[3];
      } else {
        error = new Error(error);
      }
    } else if (error instanceof ErrorModel) {
      error = error.toError();
    }
    error.isFatal = isFatal;
    this._store.addException(error);
  };
}
