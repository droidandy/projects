import { ExecutionResult } from 'graphql';
import { checkForbiddenError, launchpadUserMetadata } from '../test-utils/common';
import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';
import { logger } from '../test-utils/logger';

describe('The GraphQL hunch mutations', () => {
  beforeAll(async () => {
    await connection.create();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(() => jest.clearAllMocks());

  let createdFirstHunchId: string = null;
  let createdSecondHunchId: string = null;
  let createdThirdHunchId: string = null;

  const createUserHunchMutation = `
    mutation CreateUserHunchMutation ($targetPrice: Float!, $instId: ID!, $byDate: DateTime!, $description: String) {
      createUserHunch(data: { targetPrice: $targetPrice, instId: $instId, byDate: $byDate, description: $description }) {
        ... on CreateUserHunchSuccess {
          hunch {
            id
            instrument {
              id
            }
            targetPrice
            byDate
            description
          }
        }
        ... on InstNotFoundError {
          instNotFoundMessage: message
        }
        ... on CreateInvalidInputError {
          message
          errorCode
          requestId
        }
      }
    }
    `;

  it('cannot create a hunch without being authorized', async () => {
    const result: ExecutionResult = await gCall({
      source: createUserHunchMutation,
      variableValues: {
        targetPrice: 5.5,
        instId: '11',
        byDate: '2000-01-01Z',
        description: 'TestRunnerHunch'
      },
      graphQLErrorExpected: true
    });
    checkForbiddenError(result);
  });

  it('cannot create a hunch with invalid instId', async () => {
    const result: ExecutionResult = await gCall({
      source: createUserHunchMutation,
      variableValues: {
        targetPrice: 5.5,
        instId: '-11',
        byDate: '2000-01-01Z',
        description: 'TestRunnerHunch'
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

    expect(result.data.createUserHunch.instNotFoundMessage).toContain('-11');
  });

  it('can create a hunch for one date', async () => {
    const result: ExecutionResult = await gCall({
      source: createUserHunchMutation,
      variableValues: {
        targetPrice: 5.5,
        instId: '11',
        byDate: '2000-01-01Z',
        description: 'TestRunnerHunch'
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

    expect(result.data.createUserHunch.hunch.targetPrice).toEqual(5.5);
    expect(result.data.createUserHunch.hunch.byDate).toEqual('2000-01-01T00:00:00.000Z');
    expect(result.data.createUserHunch.hunch.description).toEqual('TestRunnerHunch');
    expect(result.data.createUserHunch.hunch.instrument.id).toEqual('11');
    createdFirstHunchId = result.data.createUserHunch.hunch.id;
    logger.info(`===> createdFirstHunchId=[${createdFirstHunchId}]`);
  });

  it('cannot create a hunch for the same instId and byDate second time', async () => {
    const result: ExecutionResult = await gCall({
      source: createUserHunchMutation,
      variableValues: {
        targetPrice: 6.5,
        instId: '11',
        byDate: '2000-01-01Z',
        description: 'TestRunnerHunch'
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

    expect(result.data.createUserHunch.errorCode).toEqual('DUPLICATE');
    expect(result.data.createUserHunch.requestId).toEqual(expect.any(String));
    expect(result.data.createUserHunch.requestId.length).toBeGreaterThan(0);
  });

  it('can create a hunch for another byDate', async () => {
    const result: ExecutionResult = await gCall({
      source: createUserHunchMutation,
      variableValues: {
        targetPrice: 6.5,
        instId: '11',
        byDate: '2000-01-02Z',
        description: 'TestRunnerHunch2'
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

    expect(result.data.createUserHunch.hunch.targetPrice).toEqual(6.5);
    expect(result.data.createUserHunch.hunch.byDate).toEqual('2000-01-02T00:00:00.000Z');
    expect(result.data.createUserHunch.hunch.description).toEqual('TestRunnerHunch2');
    expect(result.data.createUserHunch.hunch.instrument.id).toEqual('11');
    createdSecondHunchId = result.data.createUserHunch.hunch.id;
    logger.info(`===> createdSecondHunchId=[${createdSecondHunchId}]`);
  });

  it('can create a hunch for another instId', async () => {
    const result: ExecutionResult = await gCall({
      source: createUserHunchMutation,
      variableValues: {
        targetPrice: 7.5,
        instId: '2662',
        byDate: '2000-01-01Z',
        description: 'TestRunnerHunch3'
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

    expect(result.data.createUserHunch.hunch.targetPrice).toEqual(7.5);
    expect(result.data.createUserHunch.hunch.byDate).toEqual('2000-01-01T00:00:00.000Z');
    expect(result.data.createUserHunch.hunch.description).toEqual('TestRunnerHunch3');
    expect(result.data.createUserHunch.hunch.instrument.id).toEqual('2662');
    createdThirdHunchId = result.data.createUserHunch.hunch.id;
    logger.info(`===> createdThirdHunchId=[${createdThirdHunchId}]`);
  });


  const deleteUserHunchMutation = (hunchIds: string) => `
    mutation DeleteUserHunchesMutation {
      deleteUserHunches(hunchIds: [${hunchIds}]) {
        ... on DeleteSuccess {
          deleteIds
        }
        ... on DeleteInvalidInputError {
          message
          errorCode
          requestId
        }
      }
    }
    `;

  it('cannot delete a hunch without being authorized', async () => {
    const result: ExecutionResult = await gCall({
      source: deleteUserHunchMutation(createdFirstHunchId),
      graphQLErrorExpected: true
    });
    checkForbiddenError(result);
  });

  it('can delete hunches', async () => {
    const result: ExecutionResult = await gCall({
      source: deleteUserHunchMutation(`${createdFirstHunchId},${createdSecondHunchId},${createdThirdHunchId}`),
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.deleteUserHunches.deleteIds.length).toEqual(3);
    expect(result.data.deleteUserHunches.deleteIds[0]).toEqual(createdFirstHunchId);
    expect(result.data.deleteUserHunches.deleteIds[1]).toEqual(createdSecondHunchId);
    expect(result.data.deleteUserHunches.deleteIds[2]).toEqual(createdThirdHunchId);
  });
});
