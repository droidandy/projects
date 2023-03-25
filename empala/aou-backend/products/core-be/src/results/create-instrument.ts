import { createUnionType, Field, ObjectType } from 'type-graphql';
import { Instrument } from '../models/instrument';
import { CreateInstrumentError } from './instrument';

@ObjectType()
export class CreateInstrumentSuccess {
  @Field(() => [Instrument])
  public instruments: Instrument[];

  @Field(() => [CreateInstrumentError], { nullable: true })
  public errors: CreateInstrumentError[];
}

export const CreateInstrumentResult = createUnionType({
  name: 'CreateInstrumentResult',
  types: () => [CreateInstrumentSuccess],
});
