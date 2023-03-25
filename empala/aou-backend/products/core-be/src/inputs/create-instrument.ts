import { Field, InputType } from 'type-graphql';
import { EInstrumentType } from '../models/instrument';
import { ECountry } from '../enums/country';

@InputType()
export class CreateInstrumentInput {
  @Field({ nullable: false })
  public exchangeName: string;

  @Field({ nullable: false })
  public symbol: string;

  @Field({ nullable: true })
  public cusip: string;

  @Field({ nullable: true })
  public sedol?: string;

  @Field(() => EInstrumentType, { nullable: false })
  public type: EInstrumentType;

  @Field({ nullable: true })
  public description?: string;

  @Field({ nullable: false })
  public shortDescription: string;

  @Field(() => ECountry, { nullable: false })
  public country: ECountry;
}
