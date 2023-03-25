import { Field, InputType } from 'type-graphql';

@InputType()
export class InstrumentNameChangeInput {
  @Field({ nullable: false })
  public oldSymbol: string;

  @Field({ nullable: false })
  public newSymbol: string;

  @Field({ nullable: false })
  public exchangeName: string;
}
