import { IApiResponse, IDNotificationSettingUpdateRequestDTO, IDNotificationSettingUpdateResponseDTO, Injectable } from '@invest.wl/core';
import { IDNotificationAdapter } from '@invest.wl/domain/src/Notification/D.Notification.types';

@Injectable()
export class DNotificationAdapter implements IDNotificationAdapter {
  constructor(
    // @Inject(SPushNotificationStoreTid) private _pnStore: ISPushNotificationStore,
  ) {}

  public settingUpdate(req: IDNotificationSettingUpdateRequestDTO): Promise<IApiResponse<IDNotificationSettingUpdateResponseDTO>> {
    throw new Error('not implemented');
    // return this._pnStore.isShowSet(req.importantShow).then(res => ({ code: 0, data: {} }));
  }

  public closeTimeout = 4000;
}
