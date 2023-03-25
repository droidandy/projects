import { createUnionType, ObjectType, Field } from 'type-graphql';
import { CreateInvalidInputError } from '../errors/create';
import { InstNotFoundError } from '../errors/inst-not-found';
import { Stack } from '../models/stack';

@ObjectType()
export class CreateUserStackSuccess {
  @Field(() => Stack, { nullable: false })
  public stack: Stack;
}

export const CreateUserStackResult = createUnionType({
  name: 'CreateUserStackResult',
  description: 'Used for Investack mutation calls',
  types: () => [CreateUserStackSuccess, InstNotFoundError, CreateInvalidInputError],
});
