import { Inject, Injectable, Newable } from '@invest.wl/core';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { EDTimerBgName } from '../../Timer/D.Timer.types';
import { DTimerBgModel } from '../../Timer/model/D.TimerBg.model';
import { DDocumentGateway } from '../D.Document.gateway';
import { DDocumentConfigTid, DDocumentGatewayTid, IDDocumentConfig } from '../D.Document.types';
import { IDDocumentModel } from '../model/D.Document.model';
import { DDocumentSignConfirmModel, DDocumentSignConfirmModelTid } from '../model/D.DocumentSignConfirm.model';

export const DDocumentSignCaseTid = Symbol.for('DDocumentSignCaseTid');

export interface IDDocumentSignCaseProps {
  list: IDDocumentModel[];
}

@Injectable()
export class DDocumentSignCase {
  @observable.ref public props?: IDDocumentSignCaseProps;
  @observable public isBusy = false;

  public confirmModel = new this._confirmModel({ codeLength: this._cfg.codeLength });
  public timer = new DTimerBgModel({ name: EDTimerBgName.DocumentSigning });

  constructor(
    @Inject(DDocumentGatewayTid) private _gw: DDocumentGateway,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
    @Inject(DDocumentConfigTid) private _cfg: IDDocumentConfig,
    @Inject(DDocumentSignConfirmModelTid) private _confirmModel: Newable<typeof DDocumentSignConfirmModel>,
  ) {
    makeObservable(this);
  }

  @action
  public async init(props: IDDocumentSignCaseProps) {
    this.props = props;
  }

  @action.bound
  public async prepare() {
    try {
      const list = this.props?.list;
      if (!list?.length) throw this._errorService.businessHandle('Отсутствуют документы для подписания');
      this.isBusy = true;
      const res = await this._gw.signPrepare({ idList: list.map(d => d.id.toString()) });
      await this.timer.start(this._cfg.smsResentTimeout);
      return res;
    } catch (e: any) {
      e.message = `Ошибка генерации кода подписания. ${e.message}`;
      throw e;
    } finally {
      runInAction(() => this.isBusy = false);
    }
  }

  @action.bound
  public async resend() {
    try {
      const res = await this._gw.smsSend({});
      await this.timer.start(this._cfg.smsResentTimeout);
      return res;
    } catch (e: any) {
      e.message = `Ошибка переотправки кода. ${e.message}`;
      throw e;
    }
  }

  @action.bound
  public async confirm() {
    try {
      if (!this.confirmModel.isValid) throw this._errorService.businessHandle('Неверно введен код');
      this.isBusy = true;
      return await this._gw.signConfirm(this.confirmModel.asDTO);
    } catch (e: any) {
      e.message = `Ошибка подписания. ${e.message}`;
      throw e;
    } finally {
      runInAction(() => {
        this.isBusy = false;
        this.confirmModel.clear();
      });
    }
  }
}
