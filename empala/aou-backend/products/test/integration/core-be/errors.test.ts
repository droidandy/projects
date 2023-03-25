/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql, GraphQLClient } from 'graphql-request';
import { GraphQLError } from 'graphql';
import { getIdToken } from '../../../utils/src/get-idtoken';

const endpoint = process.env.APOLLO_SERVER_HOST_URI || 'http://localhost:3000';
const client = new GraphQLClient(endpoint);

const validateCommonErrorFields = (error: GraphQLError) => {
  expect(error.extensions).toBeDefined();
  expect(error.extensions.requestId).toEqual(expect.any(String));
  expect(error.extensions.requestId.length).toBeGreaterThan(0);
};

describe('core-be GraphQL errors', () => {
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

  test('unauthorized error: no header', async () => {
    let err;
    try {
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
      `, undefined, undefined);
    } catch (error: any) {
      err = error;
    }
    expect(err.response.errors.length).toEqual(1);
    const expectedError = err.response.errors[0];
    expect(expectedError.message).toBe('Context creation failed: No authorization header is given');
    expect(expectedError.extensions.code).toEqual('UNAUTHENTICATED');
    validateCommonErrorFields(expectedError);
  });

  test('unauthorized error: badly formed header', async () => {
    let err;
    try {
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
      `, undefined, { authorization: `arer ${testUserIdToken}` });
    } catch (error: any) {
      err = error;
    }
    expect(err.response.errors.length).toEqual(1);
    const expectedError = err.response.errors[0];
    expect(expectedError.message).toBe('Context creation failed: authorization header is badly formed');
    expect(expectedError.extensions.code).toEqual('UNAUTHENTICATED');
    expect(expectedError.extensions.exception.code).toEqual('AUTH_HEADER_BADLY_FORMED');
    validateCommonErrorFields(expectedError);
  });

  test('access denied to incorrect role', async () => {
    let err;
    try {
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
      `, undefined, { authorization: `Bearer ${launchpadFEReadonlyIdToken}` });
    } catch (error: any) {
      err = error;
    }
    expect(err.response.errors.length).toEqual(1);
    const expectedError = err.response.errors[0];
    expect(expectedError.message).toBe('Access denied! You need to be authorized to perform this action!');
    expect(expectedError.extensions.code).toEqual('FORBIDDEN');
    validateCommonErrorFields(expectedError);
  });

  test('invalid input error', async () => {
    let err;
    try {
      const data = await client.request(gql`
        mutation Mutation {
          createUserHunch(data: {
            targetPrice: 1,
            instId: 100000000900090090090990900909,
            byDate: "2020-01-01"
          }) {
            ... on CreateUserHunchSuccess {
              hunch {
                targetPrice
                id
              }
            }
            ... on InstNotFoundError {
              message
            }
            ... on CreateInvalidInputError {
              message
            }
          }
        }
      `, undefined, { authorization: `Bearer ${testUserIdToken}` });
    } catch (error: any) {
      err = error;
    }
    expect(err.response.errors.length).toEqual(1);
    const expectedError = err.response.errors[0];
    expect(expectedError.message).toEqual(expect.any(String));
    expect(expectedError.extensions.code).toEqual('INTERNAL_SERVER_ERROR');
    validateCommonErrorFields(expectedError);
  });

  test('invalid input type error', async () => {
    let err;
    try {
      const data = await client.request(gql`
        mutation Mutation($data: CreateHunchInput!) {
          createUserHunch(data: $data) {
            ... on CreateUserHunchSuccess {
              hunch {
                targetPrice
                id
              }
            }
            ... on InstNotFoundError {
              message
              requestId
            }
            ... on CreateInvalidInputError {
              message
              requestId
            }
          }
        }
      `, {
        data: {
          targetPrice: 1,
          instId: 100000000900.5,
          byDate: '2020-01-01',
        },
      }, { authorization: `Bearer ${testUserIdToken}` });
    } catch (error: any) {
      err = error;
    }
    expect(err.response.errors.length).toEqual(1);
    const expectedError = err.response.errors[0];
    expect(expectedError.message).toEqual(expect.any(String));
    expect(expectedError.extensions.code).toEqual('BAD_USER_INPUT');
    validateCommonErrorFields(expectedError);
  });

  test('syntax error', async () => {
    let err;
    try {
      // leave mutation line incorrect to get GRAPHQL_PARSE_FAILED error
      const data = await client.request(gql`
        mutation Mutation($data: CreateHunchInput!)
        createUserHunch(data: $data) {
        ... on CreateUserHunchSuccess {
        hunch {
        targetPrice
        id
        }
        }
        ... on InstNotFoundError {
        message
        }
        ... on CreateInvalidInputError {
        message
        }
        }
        }
      `, {
        data: {
          targetPrice: 1,
          instId: 1,
          byDate: '2020-01-01',
        },
      }, { authorization: `Bearer ${testUserIdToken}` });
    } catch (error: any) {
      err = error;
    }
    expect(err.response.errors.length).toEqual(1);
    const expectedError = err.response.errors[0];
    expect(expectedError.message).toEqual(expect.any(String));
    expect(expectedError.extensions.code).toEqual('GRAPHQL_PARSE_FAILED');
    validateCommonErrorFields(expectedError);
  });

  test('correct error on missing instrument in mutation', async () => {
    // eslint-disable-next-line id-blacklist
    const instId = Number.MAX_SAFE_INTEGER;
    const result = await client.request(
      gql`
        mutation Mutation($data: CreateHunchInput!) {
          createUserHunch(data: $data) {
            ... on CreateUserHunchSuccess {
              hunch {
                targetPrice
                id
              }
            }
            ... on InstNotFoundError {
              message
              requestId
            }
          }
        }`,
      {
        data: {
          targetPrice: 1,
          instId,
          byDate: '2030-01-01',
        },
      },
      { authorization: `Bearer ${testUserIdToken}` },
    );
    expect(result.createUserHunch.message).toEqual(`Instrument with ID given by instId=${instId} does not exist`);
    expect(result.createUserHunch.requestId).toEqual(expect.any(String));
    expect(result.createUserHunch.requestId.length).toBeGreaterThan(0);
  });

  /*
  Disabled until the limit on the amount of requested data (nMax) returned.
  See note: products/core-be/src/resolvers/instrument.ts:100
  */
  test.skip('correct error on query', async () => {
    // eslint-disable-next-line id-blacklist
    const instId = Number.MAX_SAFE_INTEGER;
    const result = await client.request(
      gql`
        query Query_root($nMax: Int!, $pattern: String!) {
          instruments(nMax: $nMax, pattern: $pattern) {
            ... on Instruments {
              instruments {
                id
                name
              }
            }
            ... on TooManyItemsRequestedError {
              message
              requestId
            }
          }
        }`,
      { nMax: 100, pattern: '%' },
      { authorization: `Bearer ${testUserIdToken}` },
    );
    expect(result.instruments.requestId).toEqual(expect.any(String));
    expect(result.instruments.requestId.length).toBeGreaterThan(0);
  });
});
