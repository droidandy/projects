import { registerEnumType } from 'type-graphql';

export enum EInvestmentExperience {
  NONE = 'NONE',
  LIMITED = 'LIMITED',
  GOOD = 'GOOD',
  EXTENSIVE = 'EXTENSIVE',
}

registerEnumType(EInvestmentExperience, { name: 'EInvestmentExperience' });
