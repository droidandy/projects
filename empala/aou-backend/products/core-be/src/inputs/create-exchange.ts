import { Field, InputType } from 'type-graphql';
import { ECountry } from '../enums/country';

@InputType()
export class CreateExchangeInput {
  @Field({ nullable: false })
  public name: string;

  @Field(() => ECountry, { nullable: false })
  public country: ECountry;
}
