import { DCurrencyCodeRuble, EDCurrencyCode, Injectable } from '@invest.wl/core';

export const DCurrencyConfigTid = Symbol.for('DCurrencyConfigTid');

@Injectable()
export class DCurrencyConfig {
  public codeRuble = DCurrencyCodeRuble;
  public order = [EDCurrencyCode.RUB, EDCurrencyCode.USD, EDCurrencyCode.EUR, EDCurrencyCode.GBP, EDCurrencyCode.CHF];
}
