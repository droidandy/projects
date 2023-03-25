import { IMapXList } from '@invest.wl/common';
import { IApiResponse, IDNotificationDTO, IDNotificationSettingUpdateRequestDTO, IDNotificationSettingUpdateResponseDTO, TObject } from '@invest.wl/core';
import { IObservableArray } from 'mobx';
import { IDNotificationModel } from './model/D.Notification.model';

export const DNotificationStoreAdapterTid = Symbol.for('DNotificationStoreAdapterTid');
export const DNotificationStoreTid = Symbol.for('DNotificationStoreTid');
export const DNotificationAdapterTid = Symbol.for('DNotificationAdapterTid');

interface IDNotificationStoreBase<M extends TObject> {
  init(): void;
  add(dto: Omit<IDNotificationDTO, 'id'>): IDNotificationDTO;
  successAdd(message: string): IDNotificationDTO;
  infoAdd(message: string): IDNotificationDTO;
  warningAdd(message: string): IDNotificationDTO;
  errorAdd(message: string): IDNotificationDTO;
  clear(): void;
  remove(item: M): void;
}

export interface IDNotificationStore extends IDNotificationStoreBase<IDNotificationModel> {
  readonly listX: IMapXList<IDNotificationModel<IDNotificationDTO>>;
}

export interface IDNotificationStoreAdapter extends IDNotificationStoreBase<IDNotificationDTO> {
  readonly list: IObservableArray<IDNotificationDTO>;
}

export interface IDNotificationAdapter {
  settingUpdate(req: IDNotificationSettingUpdateRequestDTO): Promise<IApiResponse<IDNotificationSettingUpdateResponseDTO>>;
  closeTimeout: number;
}
