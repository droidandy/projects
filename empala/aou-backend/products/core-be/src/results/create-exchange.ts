import { createUnionType, ObjectType, Field } from 'type-graphql';
import { CreateInvalidInputError } from '../errors/create';
import { CreateExchangeAlreadyExistsError } from '../errors/create-exchange-already-exists';
import { Exchange } from '../models/exchange';

@ObjectType()
export class CreateExchangeSuccess {
  @Field(() => Exchange, { nullable: false })
  public exchange: Exchange;
}

export const CreateExchangeResult = createUnionType({
  name: 'CreateExchangeResult',
  description: 'Used for Exchange mutation calls',
  types: () => [CreateExchangeSuccess, CreateExchangeAlreadyExistsError, CreateInvalidInputError],
});
