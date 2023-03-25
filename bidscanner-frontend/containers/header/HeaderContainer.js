import { compose, gql, graphql } from 'react-apollo';
import { withCookies } from 'react-cookie';

import Header from 'components/header/Header';

const me = gql`
  query me {
    me {
      id
      first_name
      last_name
    }
  }
`;

const fakeCookies = {
  get() {
    return null;
  },
};

export default compose(
  withCookies,
  graphql(me, {
    skip: ({ cookies = fakeCookies }) => !cookies.get('token'),
  })
)(Header);
