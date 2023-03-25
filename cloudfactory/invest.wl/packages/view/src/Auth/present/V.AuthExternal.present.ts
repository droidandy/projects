import { Inject, Injectable } from '@invest.wl/core';
import { DAuthExternalCase, DAuthExternalCaseTid, DNotificationStoreTid, IDAuthExternalCaseProps, IDNotificationStore } from '@invest.wl/domain';

export interface IVAuthExternalPresentProps extends IDAuthExternalCaseProps {
}

export const VAuthExternalPresentTid = Symbol.for('VAuthExternalPresentTid');

@Injectable()
export class VAuthExternalPresent {
  constructor(
    @Inject(DAuthExternalCaseTid) public cse: DAuthExternalCase,
    @Inject(DNotificationStoreTid) private _notification: IDNotificationStore,
  ) {}

  public init(props: IVAuthExternalPresentProps) {
    this.cse.init(props);
  }

  public onHttpError = (statusCode: number) => {
    if (statusCode === 409) {
      this._notification.errorAdd('Не найдена подтвержденная учетная запись пользователя');
    }
  };
}
