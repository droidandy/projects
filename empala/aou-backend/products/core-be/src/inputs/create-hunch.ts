import {
  Field, ID, InputType, Float,
} from 'type-graphql';

@InputType()
export class CreateHunchInput {
  @Field(() => Float, { nullable: false })
  public targetPrice: number;

  @Field(() => ID, { nullable: false })
  public instId: BigInt;

  @Field({ nullable: false })
  public byDate: Date;

  @Field({ nullable: true })
  public description: string;
}
