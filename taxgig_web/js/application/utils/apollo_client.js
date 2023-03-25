import { ApolloClient } from "apollo-client";
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";

const cache = new InMemoryCache();

const errorsLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = ApolloLink.from([
  errorsLink,
  new HttpLink({uri: "https://taxgig.com:4001/graphiql"}),
]);

const linkBlog = ApolloLink.from([
  errorsLink,
  new HttpLink({uri: "https://landing.taxgig.com/api/graphql"})
]);

export const client = new ApolloClient({
  cache,
  link
});


export const clientBlog = new ApolloClient({
  cache,
  link: linkBlog
});
