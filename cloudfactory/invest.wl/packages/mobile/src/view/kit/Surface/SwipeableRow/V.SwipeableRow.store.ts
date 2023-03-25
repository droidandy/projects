import { TDisposer } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';

export const VSwipeableRowStoreTid = Symbol.for('VSwipeableRowStoreTid');

enum VSwipeableRowAction {
  Close,
  Open
}

@Injectable()
export class VSwipeableRowStore {
  private _disposerCurrent?: TDisposer;
  private _lastAction = VSwipeableRowAction.Close;

  public onOpen(disposer: TDisposer) {
    this._next(disposer, this._disposerCurrent !== disposer);
    this._lastAction = VSwipeableRowAction.Open;
  }

  public onClose() {
    if (this._lastAction === VSwipeableRowAction.Close) this._next(undefined);
    this._lastAction = VSwipeableRowAction.Close;
  }

  public clear() {
    this._next();
  }

  private _next(disposer?: TDisposer, dispose = true) {
    if (dispose) this._disposerCurrent?.();
    this._disposerCurrent = disposer;
  }
}
