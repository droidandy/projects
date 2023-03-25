import { Injectable, IoC } from '@invest.wl/core';
import { ISDebugStore, SDebugStoreTid, TSDebugCommandHandler, TSDebugCommandRemover } from './S.Debug.types';

// TODO: not singleton? refact
@Injectable()
export class SDebugService {
  private _debugStore = IoC.get<ISDebugStore>(SDebugStoreTid);
  private _removers: TSDebugCommandRemover[] = [];

  public add(title: string, handler: TSDebugCommandHandler): void {
    const remover = this._debugStore.add({ title, handler });
    this._removers.push(remover);
  }

  public dispose(): void {
    while (this._removers.length) this._removers.shift()!();
  }
}
