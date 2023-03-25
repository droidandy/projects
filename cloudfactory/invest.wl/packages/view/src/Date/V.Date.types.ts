import { EDDateDayPart } from '@invest.wl/core';

export const VDateI18nTid = Symbol.for('VDateI18nTid');

export interface IVDateI18n {
  readonly monthNumber: string[];
  readonly monthShort: string[];
  readonly monthFull: string[];
  readonly dayPartWelcome: { [P in EDDateDayPart]: string };
}
