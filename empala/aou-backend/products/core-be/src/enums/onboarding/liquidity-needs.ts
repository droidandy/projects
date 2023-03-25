import { registerEnumType } from 'type-graphql';

export enum ELiquidityNeeds {
  VERY_IMPORTANT = 'VERY_IMPORTANT',
  SOMEWHAT_IMPORTANT = 'SOMEWHAT_IMPORTANT',
  NOT_IMPORTANT = 'NOT_IMPORTANT',
}

registerEnumType(ELiquidityNeeds, { name: 'ELiquidityNeeds' });
