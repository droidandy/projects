import { MapX } from '@invest.wl/common';
import { EDPortfelGroup, IDInstrumentId, Inject, Injectable, Newable } from '@invest.wl/core';
import { DPortfelCase, DPortfelCaseTid, IDPortfelCaseProps } from '@invest.wl/domain';
import { action, observable } from 'mobx';
import { VPortfelPLGroupModel, VPortfelPLGroupModelTid } from '../model/V.PortfelPLGroup.model';

export const VPortfelOfInstrumentPresentTid = Symbol.for('VPortfelOfInstrumentPresentTid');

export interface VPortfelOfInstrumentPresentProps extends IDPortfelCaseProps {
  cid: IDInstrumentId;
}

@Injectable()
export class VPortfelOfInstrumentPresent {
  @observable props?: VPortfelOfInstrumentPresentProps;

  @observable public accountActiveIndex = 0;

  public plGroupListX = new MapX.V(this.cse.plGroupX.source,
    () => {
      const id = this.props?.cid.toString();
      return this.cse.plGroupX.model?.groupX.innerX?.list.find(g => g.id === id);
    },
    (m) => new this.modelPlGroup(m));

  constructor(
    @Inject(DPortfelCaseTid) public cse: DPortfelCase,
    @Inject(VPortfelPLGroupModelTid) protected modelPlGroup: Newable<typeof VPortfelPLGroupModel>,
  ) { }

  @action
  public init(props: VPortfelOfInstrumentPresentProps) {
    this.props = props;
    this.cse.init({ ...props, groupList: [EDPortfelGroup.InstrumentId, ...props.groupList] });
  }

  public dispose() {
    this.cse.dispose();
  }

  @action
  public accountActiveSet = (index: number) => this.accountActiveIndex = index;
}
