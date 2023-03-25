import { IDNotificationAdapter } from '@invest.wl/domain/src/Notification/D.Notification.types';
import {
  IDNotificationSettingUpdateRequestDTO, IDNotificationSettingUpdateResponseDTO,
} from '@invest.wl/core/src/dto/Notification';
import { Injectable } from '@invest.wl/core/src/di/IoC';
import { IApiResponse } from '@invest.wl/core/src/types/base.types';

@Injectable()
export class DNotificationAdapter implements IDNotificationAdapter {
  constructor(
    // @Inject(SPushNotificationStoreTid) private _pnStore: ISPushNotificationStore,
  ) {}

  public settingUpdate(req: IDNotificationSettingUpdateRequestDTO): Promise<IApiResponse<IDNotificationSettingUpdateResponseDTO>> {
    throw new Error('not implemented');
    // return this._pnStore.isShowSet(req.importantShow).then(res => ({ code: 0, data: {} }));
  }
}
