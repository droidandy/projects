import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class CreateTagsInput {
  @Field(() => ID, { nullable: false })
  public instId: string;

  @Field(() => [ID], { nullable: false })
  public themeIds: BigInt[];
}
