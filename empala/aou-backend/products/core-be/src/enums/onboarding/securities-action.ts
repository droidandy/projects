import { registerEnumType } from 'type-graphql';

export enum ESecuritiesAction {
  HOLD_PROCEEDS = 'HOLD_PROCEEDS',
  SEND_PROCEEDS = 'SEND_PROCEEDS',
}

registerEnumType(ESecuritiesAction, { name: 'ESecuritiesAction' });
