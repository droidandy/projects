import { MapX } from '@invest.wl/common';
import { EDInstrumentAssetType, Inject, Injectable, Newable } from '@invest.wl/core';
import { DPortfelCase, DPortfelCaseTid, IDPortfelCaseProps } from '@invest.wl/domain';
import { action, makeObservable, observable } from 'mobx';
import { VPortfelPLGroupModel, VPortfelPLGroupModelTid } from '../model/V.PortfelPLGroup.model';

export const VPortfelInstrumentTypePresentTid = Symbol.for('VPortfelInstrumentTypePresentTid');

export interface IVPortfelInstrumentTypePresentProps extends IDPortfelCaseProps {
  type: EDInstrumentAssetType;
}

@Injectable()
export class VPortfelInstrumentTypePresent {
  @observable.ref public props?: IVPortfelInstrumentTypePresentProps;

  public plGroupX = new MapX.V(
    this.cse.plGroupX.source,
    () => this.props && this.cse.plGroupX.model?.groupX.innerX?.list.find(g => parseInt(g.id, 10) === this.props!.type),
    (m) => new this.modelPlGroup(m));

  constructor(
    @Inject(DPortfelCaseTid) public cse: DPortfelCase,
    @Inject(VPortfelPLGroupModelTid) private modelPlGroup: Newable<typeof VPortfelPLGroupModel>,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IVPortfelInstrumentTypePresentProps) {
    this.props = props;
    this.cse.init(props);
  }
}
