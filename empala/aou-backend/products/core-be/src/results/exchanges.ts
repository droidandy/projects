import { createUnionType, Field, ObjectType } from 'type-graphql';
import { Exchange } from '../models/exchange';

@ObjectType()
export class Exchanges {
  @Field(() => [Exchange], { nullable: false })
  public exchanges: Exchange[];
}

export const ExchangesResult = createUnionType({
  name: 'ExchangesResult',
  description: 'Used for exchanges query',
  types: () => [Exchanges],
});
