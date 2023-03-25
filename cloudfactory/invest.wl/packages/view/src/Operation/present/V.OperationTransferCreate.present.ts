import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DOperationTransferCreateCase, DOperationTransferCreateCaseTid, IDOperationTransferCreateCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VOperationTransferCreateModel, VOperationTransferCreateModelTid } from '../model/V.OperationTransferCreate.model';

export const VOperationTransferCreatePresentTid = Symbol.for('VOperationTransferCreatePresentTid');

export interface IVOperationTransferCreatePresentProps extends IDOperationTransferCreateCaseProps {
}

@Injectable()
export class VOperationTransferCreatePresent {
  @observable.ref public props?: IVOperationTransferCreatePresentProps;

  public createModel = new this.modelCreate(this.createCase.createModel);

  constructor(
    @Inject(DOperationTransferCreateCaseTid) public createCase: DOperationTransferCreateCase,
    @Inject(VOperationTransferCreateModelTid) private modelCreate: Newable<typeof VOperationTransferCreateModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVOperationTransferCreatePresentProps) {
    this.props = props;
    this.createCase.init(props);
  }

  @action.bound
  public create() {
    this.createModel.dirtySet();
    return this.createCase.create();
  }
}
