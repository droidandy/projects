import { Inject, Injectable, Newable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { DAuthGateway } from '../D.Auth.gateway';
import { DAuthGatewayTid } from '../D.Auth.types';
import { DAuthPasswordCreateModel, DAuthPasswordCreateModelTid } from '../model/D.AuthPasswordCreate.model';

export const DAuthPasswordCreateCaseTid = Symbol.for('DAuthPasswordCreateCaseTid');

export interface IDAuthPasswordCreateCaseProps {
}

@Injectable()
export class DAuthPasswordCreateCase {
  @observable.ref public props?: IDAuthPasswordCreateCaseProps;

  public model = new this._model();
  @observable public isBusy = false;

  constructor(
    @Inject(DAuthPasswordCreateModelTid) private _model: Newable<typeof DAuthPasswordCreateModel>,
    @Inject(DAuthGatewayTid) private _gw: DAuthGateway,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDAuthPasswordCreateCaseProps) {
    this.props = props;
  }

  @action
  public async create() {
    if (!this.model.isValid) throw this._errorService.businessHandle('Неверная пара паролей');
    try {
      this.isBusy = true;
      return await this._gw.passwordCreate({ password: this.model.asDTO.password });
    } finally {
      this.isBusy = false;
    }
  }
}
