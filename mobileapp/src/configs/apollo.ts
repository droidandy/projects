import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import { getEnvVars } from './environments';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import typeDefs from '../apollo/local.graphql';
import * as resolvers from '../apollo/resolvers';

const cache = new InMemoryCache();

const linkError = onError(function({ response, graphQLErrors, networkError }) {
  if (graphQLErrors) {
    const message = graphQLErrors[0].message;

    switch (message) {
      case 'Ошибка: авторизуйтесь для продолжения работы':
      case 'error_user_none_exists_table':
      case 'Access denied! You need to be authorized to perform this action!':
        AsyncStorage.removeItem('@AptStore:auth')
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          .then(() => client.resetStore());
        break;
      default:
        graphQLErrors.forEach(({ message, path, source }) =>
          console.log(
            `[GraphQL error]: Message: ${JSON.stringify(
              message,
            )}, path: ${path}, source: ${source}`,
          ),
        );
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);

    if (response) {
      response.errors = undefined;
    }
  }
});

const httpLink = new HttpLink({ uri: getEnvVars().graphqlUrl });

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('@AptStore:auth');
  if (token !== null && token !== '') {
    return { headers: { ...headers, Authorization: `Bearer ${token}` } };
  }
  return { headers };
});

export const client = new ApolloClient({
  link: ApolloLink.from([linkError, authLink, httpLink]),
  cache,
  typeDefs,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  resolvers,
  connectToDevTools: true,
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    mutate: {
      fetchPolicy: 'network-only',
      errorPolicy: 'none',
    },
  },
});
