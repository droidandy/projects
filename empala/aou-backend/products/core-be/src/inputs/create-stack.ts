/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class CreateStackInput {
  @Field({ nullable: false })
  public name: string;

  @Field((type) => [ID], { nullable: false })
  public instIds: BigInt[];
}
