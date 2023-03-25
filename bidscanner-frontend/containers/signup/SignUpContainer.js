// @flow
import SignUp from 'components/signup/SignUp';

import { compose, graphql, gql } from 'react-apollo';
import { withCookies } from 'react-cookie';

const providers = gql`
  query OAuthProviders {
    oauth_providers {
      edges {
        description
        authorization_url
        client_id
      }
    }
  }
`;

export default compose(withCookies, graphql(providers))(SignUp);
