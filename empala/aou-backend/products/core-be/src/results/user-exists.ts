import { createUnionType, Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserExists {
  @Field()
  public exists: boolean;
}

export const UserExistsResult = createUnionType({
  name: 'UserExistsResult',
  description: 'Used for userExists query',
  types: () => [UserExists],
});
