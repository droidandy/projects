import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class RefreshPricesViewSuccess {
  @Field()
  public success: boolean;
}
