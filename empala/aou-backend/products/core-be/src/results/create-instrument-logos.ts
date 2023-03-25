import { createUnionType, ObjectType, Field } from 'type-graphql';
import { CreateInvalidInputError } from '../errors/create';
import { InstrumentLogos } from '../models/instrument-logos';

@ObjectType()
export class CreateInstrumentLogosSuccess {
  @Field(() => InstrumentLogos, { nullable: false })
  public logos: InstrumentLogos;
}

export const CreateInstrumentLogosResult = createUnionType({
  name: 'CreateInstrumentLogosResult',
  types: () => [CreateInstrumentLogosSuccess, CreateInvalidInputError],
});
