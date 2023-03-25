import { DModelX, IDMapXList, IDModelX, ILambda, MapX } from '@invest.wl/common';
import { EDPortfelGroup, Injectable, IoC, TModelId } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { IDAccountByAgreementModel } from '../../Account/model/D.AccountByAgreement.model';
import { DPortfelConfig } from '../D.Portfel.config';
import { DPortfelStore, DPortfelStoreTid } from '../D.Portfel.store';
import { DPortfelConfigTid } from '../D.Portfel.types';
import { IDPortfelSummaryModel } from './D.PortfelSummary.model';

export const DPortfelSummaryGroupModelTid = Symbol.for('DPortfelPLByInstrumentListModelTid');

export interface IDPortfelSummaryGroupDTO {
  id: TModelId;
  list: IDPortfelSummaryModel[];
  // Очередь вложенных группировок
  groupOrder: EDPortfelGroup[];
  // Текущий уровень (index) из GroupOrder, default = 0
  groupLvl?: number;
  // TODO: fix any
  agreement?: IDAccountByAgreementModel<any>;
}

type TDTO = IDPortfelSummaryGroupDTO;

export interface IDPortfelSummaryGroupModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly groupInnerX?: IDMapXList<IDPortfelSummaryGroupModel>;
  readonly groupBy: EDPortfelGroup;
  readonly groupLvl: number;
  readonly list: IDPortfelSummaryModel[];
  readonly summary?: IDPortfelSummaryModel;
}

@Injectable()
export class DPortfelSummaryGroupModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDPortfelSummaryGroupModel<DTO> {
  private _const = IoC.get<DPortfelConfig>(DPortfelConfigTid);
  private _store = IoC.get<DPortfelStore>(DPortfelStoreTid);

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  public groupInnerX = this.groupLvl < (this.dto.groupOrder.length - 1) ? new MapX.DList(
    this._store.summaryListX.source,
    () => {
      const groupOrderNext = this.dto.groupOrder[this.groupLvl + 1];
      if (groupOrderNext == null) return;
      const group = this._const.summaryGroupMap[groupOrderNext](this.list.map(i => i.dto));
      return group.map(f => ({
        id: f.id,
        groupOrder: this.dto.groupOrder,
        groupLvl: this.groupLvl + 1,
        list: this.list.filter(pl => f.filter(pl.dto)),
      } as IDPortfelSummaryGroupDTO));
    },
    (lv) => new DPortfelSummaryGroupModel(lv),
  ) : undefined;

  @computed
  public get groupLvl() {
    return this.dto.groupLvl ?? 0;
  }

  @computed
  public get groupBy() {
    return this.dto.groupOrder[this.groupLvl];
  }

  @computed
  public get list() {
    return this.dto.list;
  }

  @computed
  public get summary() {
    return this.list.length === 1 ? this.list[0] : undefined;
  }
}
