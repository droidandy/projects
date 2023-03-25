import { IDNotificationSettingUpdateRequestDTO, Inject, Injectable } from '@invest.wl/core';
import { DNotificationAdapterTid, IDNotificationAdapter } from './D.Notification.types';

export const DNotificationGatewayTid = Symbol.for('DNotificationGatewayTid');

@Injectable()
export class DNotificationGateway {
  constructor(
    @Inject(DNotificationAdapterTid) private _adapter: IDNotificationAdapter,
  ) {}

  settingUpdate(req: IDNotificationSettingUpdateRequestDTO) {
    return this._adapter.settingUpdate(req);
  }
}
