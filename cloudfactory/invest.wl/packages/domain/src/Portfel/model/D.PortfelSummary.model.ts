import { DModelX, IDModelX, ILambda, lambdaResolve } from '@invest.wl/common';
import { EDCurrencyCode, EDTradeMarket, IDPortfelSummaryItemDTO, Injectable, IoC } from '@invest.wl/core';
import { computed, makeObservable, observable } from 'mobx';
import { DPortfelConfig } from '../D.Portfel.config';
import { DPortfelConfigTid } from '../D.Portfel.types';
import { IDPortfelPLByInstrumentModelProps } from './D.PortfelPLByInstrument.model';

export const DPortfelSummaryModelTid = Symbol.for('DPortfelSummaryModelTid');
type TDTO = IDPortfelSummaryItemDTO;

export interface IDPortfelSummaryModelProps {
  currency: ILambda<EDCurrencyCode>;
}

// детализация активов только по счетам, без разбивки по инструментам
export interface IDPortfelSummaryModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly currency: EDCurrencyCode;
  readonly market?: EDTradeMarket;
}

@Injectable()
export class DPortfelSummaryModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDPortfelSummaryModel<DTO> {
  private _const = IoC.get<DPortfelConfig>(DPortfelConfigTid);

  @observable private _props: IDPortfelPLByInstrumentModelProps;

  @computed
  public get market(): EDTradeMarket | undefined {
    return this._const.groupByMarketList.find(g => g.filter(this.dto))?.id as EDTradeMarket;
  }

  @computed
  public get currency() {
    return lambdaResolve(this._props.currency);
  }

  constructor(dtoLV: ILambda<DTO>, props: IDPortfelSummaryModelProps) {
    super(dtoLV);
    makeObservable(this);
    this._props = props;
  }
}
