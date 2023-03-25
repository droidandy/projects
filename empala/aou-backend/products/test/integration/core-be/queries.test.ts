import { GraphQLClient, gql } from 'graphql-request';
import { getIdToken } from '../../../utils/src/get-idtoken';

const endpoint = process.env.APOLLO_SERVER_HOST_URI || 'http://localhost:3000';
const client = new GraphQLClient(endpoint);

describe('Apollo GraphQL server can', () => {
  let testUserIdToken: string;
  let launchpadFEReadonlyIdToken: string;

  beforeAll(async () => {
    let result = Object(await getIdToken(
      process.env.AWS_COGNITO_TEST_USER_EMAIL,
      process.env.AWS_COGNITO_TEST_USER_PASSWORD,
    ));
    expect(result.statusCode).toBe(200);
    testUserIdToken = Object(result.response).token;

    result = Object(await getIdToken(
      process.env.AWS_COGNITO_READONLY_ADMIN_USER_NAME,
      process.env.AWS_COGNITO_READONLY_ADMIN_USER_PASSWORD,
    ));
    expect(result.statusCode).toBe(200);
    launchpadFEReadonlyIdToken = Object(result.response).token;
  }, 15000);

  it('return stacks', async () => {
    const data = await client.request(gql`
      query Query {
        currentUser {
          ... on User {
            stacks(nMax: 3) {
              id
              name
              instruments {
                symbol
              }
            }
          }
        }
      }
      `, undefined, { authorization: `Bearer ${testUserIdToken}` });
    expect(data.currentUser.stacks.length).toBe(2);
  });

  it('return achievements', async () => {
    const data = await client.request(gql`
      query Query {
        topUsers {
          ... on TopUsers {
            users {
              id
              fullName
              achievements {
                level
                name
              }
            }
          }
        }
      }
      `, undefined, { authorization: `Bearer ${launchpadFEReadonlyIdToken}` });
    expect(data.topUsers.users[0].achievements.length).toBe(2);
  });

  it('return currentUser properties', async () => {
    const data = await client.request(gql`
      query Query {
        currentUser {
          ... on User {
            id
            fullName
            userName
            email
          }
        }
      }
      `, undefined, { authorization: `Bearer ${testUserIdToken}` });
    expect(data.currentUser.email).toEqual(process.env.AWS_COGNITO_TEST_USER_EMAIL);
  });

  it('return instruments', async () => {
    const data = await client.request(gql`
      query Query {
        instruments(pattern: "AA" nMax: 5) {
          ... on Instruments {
            instruments {
              id
              symbol
              isLookupExactMatch
            }
          }
        }
      }
      `, undefined, { authorization: `Bearer ${launchpadFEReadonlyIdToken}` });
    expect(data.instruments.instruments.length).toBeGreaterThanOrEqual(3);
    expect(data.instruments.instruments.length).toBeLessThanOrEqual(5);
    expect(data.instruments.instruments[0].symbol).toEqual('AA');
    expect(data.instruments.instruments[0].isLookupExactMatch).toEqual(true);
  });
});
