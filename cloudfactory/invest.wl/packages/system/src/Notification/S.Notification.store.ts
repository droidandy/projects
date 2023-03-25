import { EDNotificationType, IDNotificationDTO, Injectable } from '@invest.wl/core';
import { action, IObservableArray, makeObservable, observable } from 'mobx';
import { ISNotificationStore } from './S.Notification.types';

@Injectable()
export class SNotificationStore implements ISNotificationStore {
  private static _id = 0;
  private static _getId = () => (SNotificationStore._id++).toString();

  @observable.shallow public list: IObservableArray<IDNotificationDTO> = [] as any;

  constructor() {
    makeObservable(this);
  }

  public init() {
    // eat
  }

  @action
  public add(dto: Omit<IDNotificationDTO, 'id'>) {
    const finded = this.list.find(e => e.message === dto.message);
    if (finded) return finded;
    const item = { ...dto, id: SNotificationStore._getId() };
    this.list.push(item);
    return item;
  }

  public successAdd(message: string) {
    return this.add({ type: EDNotificationType.Success, message });
  }

  public infoAdd(message: string) {
    return this.add({ type: EDNotificationType.Info, message });
  }

  public warningAdd(message: string) {
    return this.add({ type: EDNotificationType.Warning, message });
  }

  public errorAdd(message: string) {
    return this.add({ type: EDNotificationType.Error, message });
  }

  @action
  public remove(item: IDNotificationDTO) {
    this.list.remove(item);
  }

  @action
  public clear() {
    this.list.clear();
  }
}
