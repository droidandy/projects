import { registerEnumType } from 'type-graphql';

export enum ETimeHorizon {
  SHORT = 'SHORT',
  AVERAGE = 'AVERAGE',
  LONG = 'LONG',
}

registerEnumType(ETimeHorizon, { name: 'ETimeHorizon' });
