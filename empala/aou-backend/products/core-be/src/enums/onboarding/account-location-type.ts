import { registerEnumType } from 'type-graphql';

export enum EAccountLocationType {
  DOMESTIC = 'DOMESTIC',
  FOREIGN = 'FOREIGN',
}

registerEnumType(EAccountLocationType, { name: 'EAccountLocationType' });
