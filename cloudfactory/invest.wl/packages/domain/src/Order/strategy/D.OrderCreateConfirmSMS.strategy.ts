import { Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { EDErrorBusinessCode } from '../../Error/D.Error.types';
import { EDTimerBgName } from '../../Timer/D.Timer.types';
import { DTimerBgModel } from '../../Timer/model/D.TimerBg.model';
import { DOrderConfig, DOrderConfigTid } from '../D.Order.config';
import { IDOrderCreateConfirmStrategy } from '../D.Order.types';
import { IDOrderCreateModel } from '../model/D.OrderCreate.model';
import { IDOrderCreateConfirmModel } from '../model/D.OrderCreateConfirm.model';

@Injectable()
export class DOrderCreateConfirmSMSStrategy implements IDOrderCreateConfirmStrategy {
  public timerModel = new DTimerBgModel({ name: EDTimerBgName.OrderCreateConfirm });
  @observable public isBusy = false;

  constructor(
    @Inject(DOrderConfigTid) private _const: DOrderConfig,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  public async onCreate(model: IDOrderCreateModel) {
    await this.timerModel.start(this._const.createCodeResendInterval);
  }

  public async onConfirm(model: IDOrderCreateConfirmModel) {
    if (!model.isValid) {
      throw this._errorService.businessHandle({
        fn: `${this.constructor.name}::${__FUNCTION__}`,
        code: EDErrorBusinessCode.FormNotValid,
      });
    }
  }

  @action
  public async resend() {
    // TODO: resend SMS code
    try {
      this.isBusy = true;
      // TODO: make it
      // await this.gw.Prepare(this.Model.AsDTO);
      await this.timerModel.start(this._const.createCodeResendInterval);
    } finally {
      runInAction(() => this.isBusy = false);
    }
  }
}
