import { DModelXValue } from '@invest.wl/common';

export interface IDTimerDTO { name: EDTimerBgName }

export interface IDTimerBgModel extends DModelXValue<IDTimerDTO> {
  readonly name: string;
  readonly timeToEnd: number;
  readonly isStarted: boolean;
  readonly isEnded: boolean;
  start(timeToEndSec?: number): Promise<void>;
  clear(): Promise<void>;
}

export enum EDTimerBgName {
  AuthSigninConfirm = 'AuthSigninConfirm',
  CustomerFormCheck = 'CustomerFormCheck',
  CustomerFormDocument = 'CustomerFormDocument',
  CustomerContactFormConfirm = 'CustomerContactFormConfirm',
  OrderCreateConfirm = 'OrderCreateConfirm',
  DocumentSigning = 'DocumentSigning',
}
