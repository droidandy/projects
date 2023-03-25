import { createUnionType, Field, ObjectType } from 'type-graphql';
import { CreateInvalidInputError } from '../errors/create';
import { NotAllowedError } from '../errors/not-allowed';
import { UserFollow } from '../models/user';

@ObjectType()
export class CreateUserFollowSuccess {
  @Field(() => UserFollow)
  public userFollow: UserFollow;
}

export const CreateUserFollowResult = createUnionType({
  name: 'CreateUserFollowResult',
  types: () => [CreateUserFollowSuccess, CreateInvalidInputError, NotAllowedError],
});
