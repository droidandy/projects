import { registerEnumType } from 'type-graphql';

export enum EDividendProceedsSendFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

registerEnumType(EDividendProceedsSendFrequency, { name: 'EDividendProceedsSendFrequency' });
