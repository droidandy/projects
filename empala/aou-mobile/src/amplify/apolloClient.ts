import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import Amplify from 'aws-amplify';
import Config from 'react-native-config';

import { awsconfig } from '~/amplify/awsconfig';
import { Endpoint } from '~/amplify/types';
import store from '~/store/createStore';

Amplify.configure(awsconfig);
Amplify.Logger.LOG_LEVEL = 'DEBUG';

const httpLink = new RetryLink().split(
  (operation) => operation.getContext().clientName === Endpoint.hasura,
  new HttpLink({ uri: Config.HASURA_GRAPHQL_SERVER_URL }),
  new HttpLink({ uri: Config.CORE_GRAPHQL_SERVER_URL }),
);

const authMiddleware = new ApolloLink((operation, forward) => {
  const isHasura = operation.getContext().clientName === Endpoint.hasura;
  const additionalHeaders = isHasura
    ? { 'x-hasura-admin-secret': Config.HASURA_ADMIN_SECRET }
    : { Authorization: `Bearer ${store.getState().auth?.token}` };

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...additionalHeaders,
      'aou-account-id': store.getState().account.settings.selectedAccount.id,
    },
    type: isHasura ? Endpoint.hasura : Endpoint.core,
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});
