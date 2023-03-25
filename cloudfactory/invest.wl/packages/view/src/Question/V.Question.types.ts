import { TDQuestionSection } from '@invest.wl/core';

export const VQuestionI18nTid = Symbol.for('VQuestionI18nTid');

export interface IVQuestionI18n {
  readonly section: { [S in TDQuestionSection]: string };
}
