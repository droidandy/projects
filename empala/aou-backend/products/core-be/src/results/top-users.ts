import { createUnionType, ObjectType, Field } from 'type-graphql';
import { User } from '../models/user';

@ObjectType()
export class TopUsers {
  @Field(() => [User], { nullable: false })
  public users: User[];
}

export const TopUsersResult = createUnionType({
  name: 'TopUsersResult',
  description: 'Used for topUsers query',
  types: () => [TopUsers],
});
