import { Inject, Injectable, Newable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { DAuthGateway } from '../D.Auth.gateway';
import { DAuthGatewayTid } from '../D.Auth.types';
import { DAuthPasswordRestoreModel, DAuthPasswordRestoreModelTid } from '../model/D.AuthPasswordRestore.model';

export const DAuthPasswordRestoreCaseTid = Symbol.for('DAuthPasswordRestoreCaseTid');

export interface IDAuthPasswordRestoreCaseProps {
}

@Injectable()
export class DAuthPasswordRestoreCase {
  @observable.ref public props?: IDAuthPasswordRestoreCaseProps;

  public model = new this._model();
  @observable public isBusy = false;

  constructor(
    @Inject(DAuthPasswordRestoreModelTid) private _model: Newable<typeof DAuthPasswordRestoreModel>,
    @Inject(DAuthGatewayTid) private _gw: DAuthGateway,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDAuthPasswordRestoreCaseProps) {
    this.props = props;
  }

  @action
  public async restore() {
    if (!this.model.isValid) throw this._errorService.businessHandle('Неверный набор данных для восстановления');
    try {
      this.isBusy = true;
      return await this._gw.passwordRestore(this.model.asDTO);
    } finally {
      this.isBusy = false;
    }
  }
}
