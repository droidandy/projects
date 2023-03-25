import { EDCurrencyCode, IDOperationDepositCreateDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DAccountStore, DAccountStoreTid } from '../../Account/D.Account.store';
import { DOperationGateway, DOperationGatewayTid } from '../D.Operation.gateway';
import { DOperationDepositCreateModel, DOperationDepositCreateModelTid } from '../model/D.OperationDepositCreate.model';

export const DOperationDepositCreateCaseTid = Symbol.for('DOperationDepositCreateCaseTid');

export interface IDOperationDepositCreateCaseProps {
  dto?: IDOperationDepositCreateDTO;
}

@Injectable()
export class DOperationDepositCreateCase {
  @observable.ref public props?: IDOperationDepositCreateCaseProps;
  public createModel = new this._createModel();

  @computed
  public get agreementListX() {
    return this._store.agreementListX;
  }

  @computed
  public get currencyList() {
    return [EDCurrencyCode.RUB, EDCurrencyCode.USD, EDCurrencyCode.EUR];
  }

  constructor(
    @Inject(DAccountStoreTid) private _store: DAccountStore,
    @Inject(DOperationGatewayTid) private _gw: DOperationGateway,
    @Inject(DOperationDepositCreateModelTid) private _createModel: Newable<typeof DOperationDepositCreateModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDOperationDepositCreateCaseProps) {
    this.props = props;
    if (props.dto) this.createModel.fromDTO(props.dto);
  }

  public async create(req: IDOperationDepositCreateDTO) {
    return this._gw.depositCreate(req);
  }
}
