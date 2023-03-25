import {
  DGroupXModel,
  divide,
  DModelX,
  IDGroupXItem,
  IDGroupXModel,
  IDModelX,
  ILambda,
  lambdaResolve,
  LambdaX,
  numberEnsureZero,
  subtract,
} from '@invest.wl/common';
import {
  EDAccountMarketType,
  EDCurrencyCode,
  EDInstrumentAssetType,
  EDPortfelGroup,
  IDAccountQUIKItemDTO,
  Injectable,
  IoC,
  Newable,
  NewableType,
} from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { DAccountStore, DAccountStoreTid } from '../../Account/D.Account.store';
import { IDAccountByAgreementModel } from '../../Account/model/D.AccountByAgreement.model';
import { DAccountQUIKModel, DAccountQUIKModelTid, IDAccountQUIKModel } from '../../Account/model/D.AccountQUIK.model';
import { DPortfelConfig } from '../D.Portfel.config';
import { DPortfelStore, DPortfelStoreTid } from '../D.Portfel.store';
import { DPortfelConfigTid } from '../D.Portfel.types';
import { IDPortfelPLByInstrumentModel } from './D.PortfelPLByInstrument.model';

export const DPortfelPLGroupModelTid = Symbol.for('DPortfelPLGroupModelTid');

export interface IDPortfelPLGroupDTO extends IDGroupXItem<IDPortfelPLByInstrumentModel, EDPortfelGroup, {
  // Рыночная стоимость портфеля предыдущего group.index (по модулю)
  marketValueAbs: ILambda<number>;
}> {
}

type TDTO = IDPortfelPLGroupDTO;

export interface IDPortfelPLGroupModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly groupX: IDGroupXModel<IDPortfelPLByInstrumentModel, EDPortfelGroup, { marketValueAbs: ILambda<number> }, IDPortfelPLGroupModel>;
  readonly isEmpty: boolean;
  readonly list: IDPortfelPLByInstrumentModel[];
  readonly itemFirst?: IDPortfelPLByInstrumentModel;
  readonly account?: IDAccountQUIKModel;
  readonly agreement?: IDAccountByAgreementModel<IDAccountQUIKItemDTO>;
  readonly instrumentAssetType?: EDInstrumentAssetType;
  readonly mvPortfelPercent: number;
  readonly mvGroupPercent: number;
  readonly mvAbsOfGroup: number;
  readonly marketValue: number;
  readonly marketValueAbs: number;
  readonly marketPrice: number;
  readonly aquisition: number;
  readonly plTotal: number;
  readonly amount: number;
  readonly instrumentAquisition: number;
  readonly instrumentMarketValue: number;
  readonly instrumentYield: number;
  readonly instrumentYieldPercent: number;
  readonly instrumentPlTotal: number;
  readonly yield: number;
  readonly yieldPercent: number;
  readonly isGrow: boolean;
  readonly currency?: EDCurrencyCode;
  readonly priceAvg: number;
}

@Injectable()
export class DPortfelPLGroupModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDPortfelPLGroupModel<DTO> {
  private _const = IoC.get<DPortfelConfig>(DPortfelConfigTid);
  private _store = IoC.get<DPortfelStore>(DPortfelStoreTid);
  private _accountStore = IoC.get<DAccountStore>(DAccountStoreTid);
  private _accountModel = IoC.get<Newable<typeof DAccountQUIKModel>>(DAccountQUIKModelTid);
  private _portfelPLGroupModel = IoC.get<Newable<NewableType<IDPortfelPLGroupModel, [ILambda<TDTO>]>>>(DPortfelPLGroupModelTid);

  public groupX = new DGroupXModel({
    id: this.dto.id, order: this.dto.order, list: () => this.list, index: this.dto.index,
    data: { marketValueAbs: () => this.marketValueAbs },
    source: this._store.plByInstrumentListX.source,
    groupPropsFabric: (order) => this._const.plGroupMap[order](this.list.map(i => i.dto))
      .map(z => ({ list: this.list.filter(pl => z.filter(pl.dto)), id: z.id })),
    groupFabric: (group) => new this._portfelPLGroupModel(group),
  });

  @computed
  public get isEmpty() {
    return !this.list.length;
  }

  @computed
  public get list() {
    return LambdaX.resolve(this.dto.list);
  }

  @computed
  public get itemFirst(): IDPortfelPLByInstrumentModel | undefined {
    return this.list[0];
  }

  @computed
  // возвращаем только в том случае, если уверены что для всех PL в Tab один и тот же счет
  public get account() {
    if (this.groupX.by === EDPortfelGroup.AccountMarketType) {
      // нужно для общих плашек объедененных по AccountMarketType
      return new this._accountModel({
        MarketValue: 0, MarketType: this.dto.id as EDAccountMarketType, id: '-1',
      } as IDAccountQUIKItemDTO);
    } else if (this.groupX.by === EDPortfelGroup.AccountId) {
      return this._accountStore.listX.list.find(a => a.id === this.groupX.id);
    }
    return;
  }

  @computed
  // возвращаем только в том случае, если уверены что для всех PL в Tab один и тот же договор
  public get agreement() {
    return this.groupX.by === EDPortfelGroup.AgreementId
      ? this._accountStore.agreementListX.list.find(a => a.id === this.groupX.id) : undefined;
  }

  @computed
  public get currency() {
    return this.itemFirst?.currency;
  }

  @computed
  public get instrumentAssetType() {
    if (![EDPortfelGroup.InstrumentAssetType, EDPortfelGroup.InstrumentId].includes(this.groupX.by)) {
      return;
    }
    return parseInt(this.id, 10) as EDInstrumentAssetType;
  }

  @computed
  public get mvPortfelPercent() {
    return divide(this.marketValueAbs, this._store.mvAbs) * 100;
  }

  @computed
  public get mvGroupPercent() {
    return divide(this.marketValueAbs, this.mvAbsOfGroup) * 100;
  }

  @computed
  public get mvAbsOfGroup() {
    return lambdaResolve(this.dto.data?.marketValueAbs) || 0;
  }

  @computed
  public get marketValue() {
    return numberEnsureZero(this.list.reduce((acc, pl) => acc + pl.marketValue, 0));
  }

  @computed
  public get marketValueAbs() {
    return numberEnsureZero(this.list.reduce((acc, pl) => acc + pl.marketValueAbs, 0));
  }

  @computed
  public get marketPrice() {
    return numberEnsureZero(this.list.reduce((acc, pl) => acc + pl.marketPrice, 0));
  }

  @computed
  public get aquisition() {
    return numberEnsureZero(this.list.reduce((acc, pl) => acc + pl.aquisition, 0));
  }

  @computed
  public get plTotal() {
    return numberEnsureZero(this.list.reduce((acc, pl) => acc + pl.plTotal, 0));
  }

  @computed
  public get amount() {
    return numberEnsureZero(this.list.reduce((acc, pl) => acc + pl.amount, 0));
  }

  @computed
  public get priceAvg() {
    return numberEnsureZero(this.list.reduce((acc, pl) => acc + pl.priceAvg, 0));
  }

  @computed
  public get instrumentPlTotal() {
    return numberEnsureZero(this.list.reduce((acc, pl) => acc + pl.instrumentPlTotal, 0));
  }

  @computed
  public get instrumentMarketValue() {
    return numberEnsureZero(this.list.reduce((acc, pl) => acc + pl.instrumentMarketValue, 0));
  }

  @computed
  public get instrumentAquisition() {
    return numberEnsureZero(this.list.reduce((acc, pl) => acc + pl.instrumentAquisition, 0));
  }

  @computed
  public get instrumentYield() {
    return subtract(this.instrumentMarketValue, this.instrumentAquisition);
  }

  @computed
  public get instrumentYieldPercent() {
    return divide(this.instrumentYield, this.instrumentAquisition) * 100;
  }

  @computed
  public get yield() {
    return subtract(this.marketValue, this.aquisition);
  }

  @computed
  public get yieldPercent() {
    return divide(this.yield, this.aquisition) * 100;
  }

  @computed
  public get isGrow() {
    return this.yield >= 0;
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }
}
