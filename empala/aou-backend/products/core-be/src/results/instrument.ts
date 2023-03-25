import { createUnionType, Field, ObjectType } from 'type-graphql';
import { TooManyItemsRequestedError } from '../errors/too-many-items-requested';
import { Instrument } from '../models/instrument';
import { ECountry } from '../enums/country';

@ObjectType()
export class Instruments {
  @Field(() => [Instrument], { nullable: false })
  public instruments: Instrument[];
}

export const InstrumentsResult = createUnionType({
  name: 'InstrumentsResult',
  description: 'Used for instruments query',
  types: () => [Instruments, TooManyItemsRequestedError],
});

@ObjectType()
export class CreateInstrumentError {
  @Field({ nullable: true })
  public symbol: string;

  @Field({ nullable: true })
  public cusip: string;

  @Field({ nullable: false })
  public country: ECountry;

  @Field({ nullable: true })
  public exchangeName: string;

  @Field({ nullable: false })
  public errorMessage: string;
}
