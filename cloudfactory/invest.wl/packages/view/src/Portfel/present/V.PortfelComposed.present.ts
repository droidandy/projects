import { MapX } from '@invest.wl/common';
import { EDInstrumentAssetType, EDPortfelGroup, Inject, Injectable, ISelectItem, Newable, TModelId } from '@invest.wl/core';
import { DPortfelCase, DPortfelCaseTid } from '@invest.wl/domain';
import { action, computed, makeObservable, observable } from 'mobx';
import { VPortfelPLGroupModel, VPortfelPLGroupModelTid } from '../model/V.PortfelPLGroup.model';
import { VPortfelSummaryGroupModel, VPortfelSummaryGroupModelTid } from '../model/V.PortfelSummaryGroup.model';
import { VPortfelYieldHistoryModel, VPortfelYieldHistoryModelTid } from '../model/V.PortfelYieldHistory.model';
import { IVPortfelPresentProps, VPortfelPresent } from './V.Portfel.present';

export const VPortfelComposedPresentTid = Symbol.for('VPortfelComposedPresentTid');

export interface IVPortfelComposedPresentProps extends IVPortfelPresentProps {
}

@Injectable()
export class VPortfelComposedPresent extends VPortfelPresent {
  @observable public plGroupSelectedIndex = 0;
  @observable public accountIdSelected?: TModelId = undefined;
  @observable public instrumentTypeSelected?: EDInstrumentAssetType = undefined;

  @computed
  public get plGroupSelected() {
    return this.plGroupComposedListX.list[this.plGroupSelectedIndex];
  }

  @computed
  public get plGroupByAccountSelected() {
    if (!this._needAccountGrouping || !this.accountIdSelected) return this.plGroupSelected.groupX.innerAllX!.model!;
    return this.plGroupSelected.groupX.innerX!.list.find(g => g.id === this.accountIdSelected)!;
  }

  @computed
  public get accountList(): ISelectItem<TModelId>[] {
    if (!this._needAccountGrouping || !this.plGroupX.source.isLoaded) return [];
    return this.plGroupSelected.groupX.innerX!.list.map(g => ({ name: g.id, value: g.id })) || [];
  }

  public plGroupComposedListX = new MapX.VProxyList(
    () => {
      const groupX = this.plGroupX.model?.groupX;
      if (!groupX || !groupX.innerAllX?.model || !groupX.innerX) return [];
      return groupX.innerX.list.length > 1 ? [groupX.innerAllX.model, ...groupX.innerX.list] : [groupX.innerAllX.model];
    },
    this.plGroupX.source,
  );

  @computed
  private get _needAccountGrouping() {
    const innerGroupX = this.plGroupSelected.groupX.innerAllX?.model?.groupX;
    return innerGroupX?.domain.by === EDPortfelGroup.AccountId && !!innerGroupX.innerX;
  }

  constructor(
  @Inject(DPortfelCaseTid) cse: DPortfelCase,
    @Inject(VPortfelPLGroupModelTid) modelPlGroup: Newable<typeof VPortfelPLGroupModel>,
    @Inject(VPortfelSummaryGroupModelTid) modelSummaryGroup: Newable<typeof VPortfelSummaryGroupModel>,
    @Inject(VPortfelYieldHistoryModelTid) modelYieldHistory: Newable<typeof VPortfelYieldHistoryModel>,
  ) {
    super(cse, modelPlGroup, modelSummaryGroup, modelYieldHistory);
    makeObservable(this);
  }

  @action
  public plGroupSelect = (index: number) => {
    this.accountIdSelected = undefined;
    this.plGroupSelectedIndex = index;
  };

  @action
  public accountIdSelect = (id?: TModelId) => this.accountIdSelected = id;

  @action
  public instrumentTypeSelect = (type: EDInstrumentAssetType) =>
    this.instrumentTypeSelected = type === this.instrumentTypeSelected ? undefined : type;
}
