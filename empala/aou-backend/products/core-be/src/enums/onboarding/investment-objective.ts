import { registerEnumType } from 'type-graphql';

export enum EInvestmentObjective {
  CAPITAL_PRESERVATION = 'CAPITAL_PRESERVATION',
  INCOME = 'INCOME',
  GROWTH = 'GROWTH',
  SPECULATION = 'SPECULATION',
  GROWTH_INCOME = 'GROWTH_INCOME',
  MAXIMUM_GROWTH = 'MAXIMUM_GROWTH',
  BALANCED = 'BALANCED',
  OTHER = 'OTHER',
}

registerEnumType(EInvestmentObjective, { name: 'EInvestmentObjective' });
