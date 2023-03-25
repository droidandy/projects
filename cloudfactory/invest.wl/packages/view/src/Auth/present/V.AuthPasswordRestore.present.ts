import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DAuthPasswordRestoreCase, DAuthPasswordRestoreCaseTid, IDAuthPasswordRestoreCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VAuthPasswordRestoreModel, VAuthPasswordRestoreModelTid } from '../model/V.AuthPasswordRestore.model';

export const VAuthPasswordRestorePresentTid = Symbol.for('VAuthPasswordRestorePresentTid');

export interface IVAuthPasswordRestorePresentProps extends IDAuthPasswordRestoreCaseProps {
}

@Injectable()
export class VAuthPasswordRestorePresent {
  @observable.ref public props?: IVAuthPasswordRestorePresentProps;

  public model = new this.modelPasswordRestore(this.cse.model);

  constructor(
    @Inject(DAuthPasswordRestoreCaseTid) public cse: DAuthPasswordRestoreCase,
    @Inject(VAuthPasswordRestoreModelTid) private modelPasswordRestore: Newable<typeof VAuthPasswordRestoreModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVAuthPasswordRestorePresentProps) {
    this.props = props;
    this.cse.init(props);
  }

  public restore = async () => {
    this.model.dirtySet();
    await this.cse.restore();
  };
}
