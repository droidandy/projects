import { IDOperationTransferCreateDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DOperationTransferCreateModel, DOperationTransferCreateModelTid } from '../model/D.OperationTransferCreate.model';

export const DOperationTransferCreateCaseTid = Symbol.for('DOperationTransferCreateCaseTid');

export interface IDOperationTransferCreateCaseProps {
  dto?: IDOperationTransferCreateDTO;
}

@Injectable()
export class DOperationTransferCreateCase {
  @observable.ref public props?: IDOperationTransferCreateCaseProps;

  public createModel = new this._createModel();

  constructor(
    @Inject(DOperationTransferCreateModelTid) private _createModel: Newable<typeof DOperationTransferCreateModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDOperationTransferCreateCaseProps) {
    this.props = props;
    if (props.dto) this.createModel.fromDTO(props.dto);
  }

  @action
  public async create() {

  }
}
