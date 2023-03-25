import { gql, graphql, compose } from 'react-apollo';

import Account from 'components/account/Account';

const ME_QUERY = gql`
  query {
    me {
      id
      first_name
      last_name
      portfolios {
        id
        name
        subcategories {
          name
        }
      }
      profile_photo {
        images {
          bucket_key
        }
      }
    }
  }
`;

export default compose(
  graphql(ME_QUERY, {
    name: 'me',
  })
)(Account);
