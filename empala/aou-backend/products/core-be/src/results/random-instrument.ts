import { createUnionType } from 'type-graphql';
import { Instrument } from '../models/instrument';
import { InstNotFoundError } from '../errors/inst-not-found';

export const OneRandomInstrumentResult = createUnionType({
  name: 'OneRandomInstrumentResult',
  description: 'Used for oneRandomInstrument query',
  types: () => [Instrument, InstNotFoundError],
});
