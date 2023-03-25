import { createUnionType, ObjectType, Field } from 'type-graphql';
import { CreateInvalidInputError } from '../errors/create';
import { CreateUserAlreadyExistsError } from '../errors/create-user-already-exists';
import { InstNotFoundError } from '../errors/inst-not-found';
import { User } from '../models/user';

@ObjectType()
export class CreateUserSuccess {
  @Field(() => User, { nullable: false })
  public user: User;
}

export const CreateUserResult = createUnionType({
  name: 'CreateUserResult',
  description: 'Used for User mutation calls',
  types: () => [CreateUserSuccess, CreateUserAlreadyExistsError, CreateInvalidInputError, InstNotFoundError],
});
