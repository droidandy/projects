import { DocumentNode } from 'graphql';
import { ApolloClient } from 'apollo-client';

export async function fromCacheOrServer<Query, QueryVariables = {}>(
  client: ApolloClient<{}>,
  query: DocumentNode,
  variables?: QueryVariables,
): Promise<Query | null> {
  try {
    const { data } = await client.query<Query, QueryVariables>({
      query,
      fetchPolicy: 'cache-first',
      variables,
    });
    return data;
  } catch (e) {}
  return null;
}
