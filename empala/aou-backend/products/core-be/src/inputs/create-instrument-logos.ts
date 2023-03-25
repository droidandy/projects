import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class CreateInstrumentLogosInput {
  @Field(() => ID, { nullable: false })
  public instId: BigInt;

  @Field({ nullable: true })
  public logo: string | null;

  @Field({ nullable: true })
  public logoOriginal: string | null;

  @Field({ nullable: true })
  public logoNormal: string | null;

  @Field({ nullable: true })
  public logoThumbnail: string | null;

  @Field({ nullable: true })
  public logoSquare: string | null;

  @Field({ nullable: true })
  public logoSquareStrict: string | null;
}
