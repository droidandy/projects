import { II18nMap } from '@invest.wl/common';
import { EDCurrencyCode } from '@invest.wl/core';

export const VCurrencyI18nTid = Symbol.for('VCurrencyI18nTid');

export interface IVCurrencyI18n {
  name: { [T in EDCurrencyCode]: II18nMap };
}
