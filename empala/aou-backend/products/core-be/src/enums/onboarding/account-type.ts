import { registerEnumType } from 'type-graphql';

// MARGIN and IRA accounts are not supported in our APEX UAT environment
export enum EAccountType {
  CASH = 'CASH',
// MARGIN
// TRADITIONAL
// ROTH
}

registerEnumType(EAccountType, { name: 'EAccountType' });
