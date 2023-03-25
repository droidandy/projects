import { apolloClient } from '~/amplify/apolloClient';
import {
  Instrument, OneRandomInstDocument, Query,
} from '~/graphQL/core/generated-types';

export const fetchTagsBySelectedCompanies = (
  selectedCompanies: { id: number | string }[],
): Promise<Instrument> => apolloClient
  .query<Query>({
  query: OneRandomInstDocument,
  variables: { oneRandomInstInstIds: selectedCompanies?.map((i) => i.id) },
})
  .then(
    (queryData) => (queryData.data.oneRandomInst as Instrument),
    (err) => ({}) as Instrument,
  );
