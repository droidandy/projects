import { Inject, Injectable, Newable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { DAuthGateway } from '../D.Auth.gateway';
import { DAuthGatewayTid } from '../D.Auth.types';
import { DAuthPasswordChangeModel, DAuthPasswordChangeModelTid } from '../model/D.AuthPasswordChange.model';

export const DAuthPasswordChangeCaseTid = Symbol.for('DAuthPasswordChangeCaseTid');

export interface IDAuthPasswordChangeCaseProps {
}

@Injectable()
export class DAuthPasswordChangeCase {
  @observable.ref public props?: IDAuthPasswordChangeCaseProps;

  public model = new this._changeModel();

  constructor(
    @Inject(DAuthPasswordChangeModelTid) private _changeModel: Newable<typeof DAuthPasswordChangeModel>,
    @Inject(DAuthGatewayTid) private _gw: DAuthGateway,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDAuthPasswordChangeCaseProps) {
    this.props = props;
  }

  @action.bound
  public async change() {
    if (!this.model.isValid) throw this._errorService.businessHandle('Пароли не совпадают');
    try {
      const cred = this.model.asDTO;
      await this._gw.passwordChange({ password: cred.password, passwordOld: cred.passwordOld });
    } finally {
      this.model.clear();
    }
  }
}
