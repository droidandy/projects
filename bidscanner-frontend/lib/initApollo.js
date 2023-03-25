// @flow
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import fetch from 'isomorphic-fetch';
import config from 'context/config';

let apolloClient = null;

if (!process.browser) {
  global.fetch = fetch;
}

function create(cookies) {
  const networkInterface = createNetworkInterface({
    // uri: 'https://api.bidscanner.com/graphql', // Server URL (must be absolute)
    uri: `${config.BASE_URL}/graphql`, // Server URL (must be absolute)
    opts: {
      // Additional fetch() options like `credentials` or `headers`
      credentials: 'include',
    },
  });

  networkInterface.use([
    {
      applyMiddleware(req, next) {
        const token = cookies.get('token');

        if (!req.options.headers) {
          req.options.headers = {}; // Create the header object if needed.
        }

        req.options.headers.authorization = token ? `Bearer ${token}` : null;

        next();
      },
    },
  ]);

  return new ApolloClient({
    dataIdFromObject: o => o.id,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    networkInterface,
    shouldBatch: true,
  });
}

export default function initApollo(cookies) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(cookies);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(cookies);
  }

  return apolloClient;
}
