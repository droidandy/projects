import { createUnionType } from 'type-graphql';
import { InstNotFoundError } from '../errors/inst-not-found';
import { TPSPDataFetchError } from '../errors/tpsp-data-fetch-error';
import { InstrumentLogos } from '../models/instrument-logos';

export const InstrumentLogosResult = createUnionType({
  name: 'InstrumentLogosResult',
  types: () => [InstrumentLogos, InstNotFoundError, TPSPDataFetchError],
});
