import { registerEnumType } from 'type-graphql';

export enum EDividendProceedsAction {
  SEND = 'SEND',
  HOLD = 'HOLD',
}

registerEnumType(EDividendProceedsAction, { name: 'EDividendProceedsAction' });
