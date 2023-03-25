import { TSDebugCommandHandler, ISDebugStore, SDebugStoreTid, TSDebugCommandRemover } from './S.Debug.types';
import { Injectable, IoC } from '@invest.wl/core/src/di/IoC';

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
