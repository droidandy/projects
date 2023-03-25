import { registerEnumType } from 'type-graphql';

export enum ERiskTolerance {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

registerEnumType(ERiskTolerance, { name: 'ERiskTolerance' });
