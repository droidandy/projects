import { action, makeObservable, observable } from 'mobx';

interface IEventXProps {
  fireOnSubscribe: boolean;
}

export type IEventXSubscription<V> = (value?: V) => void;

export class EventX<V> {
  private _list: IEventXSubscription<V>[] = [];
  @observable public value?: V;

  constructor(
    private _props?: IEventXProps,
  ) {
    makeObservable(this);
  }

  @action
  public emit(value: V) {
    this.value = value;
    this._list.forEach(s => s(value));
  }

  public subscribe(fn: IEventXSubscription<V>) {
    this._list.push(fn);
    if (this._props?.fireOnSubscribe && this.value) fn(this.value);
    return () => this.unsubscribe(fn);
  }

  public unsubscribe(fn: IEventXSubscription<V>) {
    const index = this._list.findIndex(i => i === fn);
    if (index !== -1) this._list.splice(index, 1);
  }

  public dispose() {
    this._list = [];
    this.value = undefined;
  }
}
