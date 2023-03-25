import { createUnionType, ObjectType, Field } from 'type-graphql';
import { CreateInvalidInputError } from '../errors/create';
import { InstNotFoundError } from '../errors/inst-not-found';
import { Hunch } from '../models/hunch';

@ObjectType()
export class CreateUserHunchSuccess {
  @Field(() => Hunch, { nullable: false })
  public hunch: Hunch;
}

export const CreateUserHunchResult = createUnionType({
  name: 'CreateUserHunchResult',
  description: 'Used for Hunch mutation calls',
  types: () => [CreateUserHunchSuccess, InstNotFoundError, CreateInvalidInputError],
});
