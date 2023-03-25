import { Formatter, IVModelX, VModelX } from '@invest.wl/common';
import { EDTradeDirection, Injectable } from '@invest.wl/core';
import { IDInstrumentInfoModel } from '@invest.wl/domain';
import { IVInstrumentIdentityMpart, VInstrumentIdentityMpart } from '../mpart/V.InstrumentIdentity.mpart';
import { IVInstrumentInfoMpart, VInstrumentInfoMpart } from '../mpart/V.InstrumentInfo.mpart';

export const VInstrumentInfoModelTid = Symbol.for('VInstrumentInfoModelTid');

export interface IVInstrumentInfoModel extends IVModelX<IDInstrumentInfoModel> {
  readonly identity: IVInstrumentIdentityMpart;
  readonly info: IVInstrumentInfoMpart;
  priceLastDeal(bs: EDTradeDirection): string;
}

@Injectable()
export class VInstrumentInfoModel extends VModelX<IDInstrumentInfoModel> implements IVInstrumentInfoModel {
  public identity = new VInstrumentIdentityMpart(() => this.domain.dto);
  public info = new VInstrumentInfoMpart(() => this.domain.dto);

  public priceLastDeal(bs: EDTradeDirection) {
    const dto = this.domain.dto;
    const value = this.info.isBond
      ? bs === EDTradeDirection.Buy ? dto.AskMoney : dto.BidMoney
      : bs === EDTradeDirection.Buy ? dto.Ask : dto.Bid;
    return Formatter.currency(value, { code: this.info.currency, priceStep: dto.PriceStep });
  }
}

