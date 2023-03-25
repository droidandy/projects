import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DAuthPasswordCreateCase, DAuthPasswordCreateCaseTid, IDAuthPasswordCreateCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VAuthPasswordCreateModel, VAuthPasswordCreateModelTid } from '../model/V.AuthPasswordCreate.model';

export const VAuthPasswordCreatePresentTid = Symbol.for('VAuthPasswordCreatePresentTid');

export interface IVAuthPasswordCreatePresentProps extends IDAuthPasswordCreateCaseProps {
}

@Injectable()
export class VAuthPasswordCreatePresent {
  @observable.ref public props?: IVAuthPasswordCreatePresentProps;

  public model = new this._createModel(this.cse.model);

  constructor(
    @Inject(DAuthPasswordCreateCaseTid) public cse: DAuthPasswordCreateCase,
    @Inject(VAuthPasswordCreateModelTid) private _createModel: Newable<typeof VAuthPasswordCreateModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVAuthPasswordCreatePresentProps) {
    this.props = props;
    this.cse.init(props);
  }

  public create = async () => {
    this.model.dirtySet();
    await this.cse.create();
  };
}
