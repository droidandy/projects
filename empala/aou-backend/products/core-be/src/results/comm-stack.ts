import { createUnionType, Field, ObjectType } from 'type-graphql';
import { CommStack } from '../models/comm-stack';

@ObjectType()
export class CommStacks {
  @Field(() => [CommStack])
  public commStacks: CommStack[];
}

export const CommStacksResult = createUnionType({
  name: 'CommStacksResult',
  description: 'Used for communityStacks query',
  types: () => [CommStacks],
});
