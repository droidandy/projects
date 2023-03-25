import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DAuthPasswordChangeCase, DAuthPasswordChangeCaseTid, IDAuthPasswordChangeCaseProps } from '@invest.wl/domain';
import { action, makeObservable } from 'mobx';
import { IVRouterService, VRouterServiceTid } from '../../Router/V.Router.types';
import { VAuthPasswordChangeModel, VAuthPasswordChangeModelTid } from '../model/V.AuthPasswordChange.model';

export const VAuthPasswordChangePresentTid = Symbol.for('VAuthPasswordChangePresentTid');

export interface IVAuthPasswordChangePresentProps extends IDAuthPasswordChangeCaseProps {
}

@Injectable()
export class VAuthPasswordChangePresent {
  public model = new this._changeModel(this.cse.model);

  constructor(
    @Inject(DAuthPasswordChangeCaseTid) public cse: DAuthPasswordChangeCase,
    @Inject(VRouterServiceTid) public router: IVRouterService,
    @Inject(VAuthPasswordChangeModelTid) private _changeModel: Newable<typeof VAuthPasswordChangeModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVAuthPasswordChangePresentProps) {
    this.cse.init(props);
  }

  public change = async () => {
    this.model.dirtySet();
    await this.cse.change();
  };
}
