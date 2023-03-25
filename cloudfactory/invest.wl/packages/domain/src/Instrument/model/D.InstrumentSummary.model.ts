import { DModelX, IDModelX, ILambda, lambdaResolve } from '@invest.wl/common';
import {
  EDInstrumentTradeState,
  EDOrderCreateCan,
  EDPortfelTradingState,
  IDAccountDTO,
  IDInstrumentSummaryResponseDTO,
  Injectable,
} from '@invest.wl/core';
import { computed, makeObservable, observable } from 'mobx';
import { DInstrumentTypeMpart, IDInstrumentTypeMpart } from '../mpart/D.InstrumentType.mpart';

export const DInstrumentSummaryModelTid = Symbol.for('DInstrumentSummaryModelTid');
type TDTO = IDInstrumentSummaryResponseDTO;

export interface IDInstrumentSummaryModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  isFavorite: boolean;
  readonly type: IDInstrumentTypeMpart;
  readonly accountList?: IDModelX<IDAccountDTO>[];
  readonly orderCan: EDOrderCreateCan;
  // пока не использовать
  readonly buyCan: boolean;
  // пока не использовать
  readonly sellCan: boolean;
}

export interface IDInstrumentSummaryModelProps {
  accountList?: ILambda<IDModelX<IDAccountDTO>[] | undefined>;
}

@Injectable()
export class DInstrumentSummaryModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDInstrumentSummaryModel<DTO> {
  public static canOrderMap = {
    [EDPortfelTradingState.Cant]: EDOrderCreateCan.Cant,
    [EDPortfelTradingState.DisabledForProduct]: EDOrderCreateCan.ErrorDisabledForProduct,
    [EDPortfelTradingState.Disabled]: EDOrderCreateCan.ErrorDisabled,
    [EDPortfelTradingState.DisabledForAccount]: EDOrderCreateCan.ErrorDisabledForAccount,
    [EDPortfelTradingState.DisabledNoAccount]: EDOrderCreateCan.ErrorDisabledNoAccount,
    [EDPortfelTradingState.NotAvailable]: EDOrderCreateCan.ErrorNotAvailable,
    [EDPortfelTradingState.Excluded]: EDOrderCreateCan.ErrorInstrumentNotAvailable,
    [EDPortfelTradingState.IsOTC]: EDOrderCreateCan.IsOTC,
    [EDPortfelTradingState.NotAllowedToBuy]: EDOrderCreateCan.NotAllowedToBuy,
    [EDPortfelTradingState.Can]: EDOrderCreateCan.OK,
  };

  public type = new DInstrumentTypeMpart(() => this.dto.Instrument);

  @observable private _isFavorite?: boolean;
  @computed
  public get isFavorite() {
    return this._isFavorite ?? this.dto.Instrument.IsFavorite;
  }

  public set isFavorite(v: boolean) {
    this._isFavorite = v;
  }

  @computed
  public get accountList() {
    return lambdaResolve(this._props.accountList);
  }

  @computed
  public get orderCan() {
    const instrument = this.dto.Instrument;
    if (instrument.State === EDInstrumentTradeState.Stopped) {
      return EDOrderCreateCan.ErrorSessionClosed;
    }
    if (this.accountList && !this.accountList.length) {
      return EDOrderCreateCan.ErrorNoAccount;
    }
    return DInstrumentSummaryModel.canOrderMap[instrument.CanOrder];
  }

  @computed
  public get buyCan() {
    // TODO: вывести алгоритм
    return false;
  }

  @computed
  public get sellCan() {
    // TODO: вывести алгоритм
    return false;
  }

  constructor(dtoLV: ILambda<DTO>, private _props: IDInstrumentSummaryModelProps = {}) {
    super(dtoLV);
    makeObservable(this);
  }

  public lvSet(dtoLV: ILambda<DTO>) {
    super.lvSet(dtoLV);
    this._isFavorite = undefined;
  }
}
