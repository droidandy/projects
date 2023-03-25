import {
  createUnionType, Field, ObjectType, ID,
} from 'type-graphql';
import { DeleteInvalidInputError } from '../errors/delete';

@ObjectType()
export class DeleteSuccess {
  @Field(() => [ID], { nullable: false })
  public deleteIds: BigInt[];
}

export const DeleteResult = createUnionType({
  name: 'DeleteResult',
  description: 'Used for delete mutation calls',
  types: () => [DeleteSuccess, DeleteInvalidInputError],
});
