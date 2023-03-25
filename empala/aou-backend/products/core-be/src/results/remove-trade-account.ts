import { createUnionType, Field, ObjectType } from 'type-graphql';
import { TypeWithMessageAndRequestId } from '../utils/graphql/common';

export const RemoveTradeAccountResult = createUnionType({
  name: 'RemoveTradeAccountResult',
  description: 'Used for remove Application mutation',
  types: () => [RemoveTradeAccountSuccess, ApplicationNotFoundResult],
});

@ObjectType()
export class RemoveTradeAccountSuccess {
  @Field()
  public message: string;
}

@ObjectType({ implements: TypeWithMessageAndRequestId })
export class ApplicationNotFoundResult extends TypeWithMessageAndRequestId {}
