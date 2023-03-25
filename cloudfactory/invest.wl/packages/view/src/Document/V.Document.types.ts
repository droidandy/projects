import { EDDocumentStatus } from '@invest.wl/core';

export const VDocumentI18nTid = Symbol.for('VDocumentI18nTid');

export interface IVDocumentI18n {
  status: { [T in EDDocumentStatus]: string };
}
