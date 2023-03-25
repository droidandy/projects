import { Injectable } from '@invest.wl/core';
import { action, observable } from 'mobx';
import { ISDebugCommand, ISDebugStore } from './S.Debug.types';

@Injectable()
export class SDebugStore implements ISDebugStore {
  @observable.shallow public commands: ISDebugCommand[] = [];

  @action
  public add(command: ISDebugCommand): () => void {
    this.commands.push(command);
    return () => {
      const index = this.commands.indexOf(command);
      this.commands.splice(index, 1);
    };
  }
}

// TODO: check this
export const gDebugStore = new SDebugStore();
