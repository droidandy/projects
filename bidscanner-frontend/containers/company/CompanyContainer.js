import { gql, graphql, compose } from 'react-apollo';
import { get } from 'lodash';

import Company from 'components/company/Company';

const ME_QUERY = gql`
  query {
    me {
      id
      companies {
        edges {
          admin
          node {
            id
            name
            logo {
              id
              images {
                id
                bucket_key
              }
            }
          }
        }
      }
    }
  }
`;

export default compose(
  graphql(ME_QUERY, {
    name: 'me',
    props: ({ me }) => {
      const companies = get(me, 'me.companies.edges') || [];

      // don't delete node field completely, just create copy on one level higher
      return {
        companies: companies.map(v => ({
          ...v,
          ...v.node,
          logoBucketKey: get(v, 'node.logo.images[0].bucket_key'),
        })),
      };
    },
  })
)(Company);
