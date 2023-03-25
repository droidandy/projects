import { ExecutionResult } from 'graphql';
import { checkForbiddenError, launchpadUserMetadata } from '../test-utils/common';
import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';
import { logger } from '../test-utils/logger';

describe('The GraphQL stack mutations', () => {
  beforeAll(async () => {
    await connection.create();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(() => jest.clearAllMocks());

  let createdStackId: string = null;

  const createUserStackMutation = (instIds: string) => `
    mutation CreateUserStackMutation {
      createUserStack(data: { name: "TestRunnerStack", instIds: [${instIds}] }) {
        ... on CreateUserStackSuccess {
          stack {
            id
            name
            instruments {
              symbol
            }
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

  it('cannot create a stack without being authorized', async () => {
    const result: ExecutionResult = await gCall({
      source: createUserStackMutation('11,2662'),
      graphQLErrorExpected: true
    });
    checkForbiddenError(result);
  });

  it('cannot create a stack with invalid instIds', async () => {
    let result: ExecutionResult = await gCall({
      source: createUserStackMutation('11,-2662'),
      variableValues: {},
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.createUserStack.instNotFoundMessage).toContain('-2662');

    result = await gCall({
      source: createUserStackMutation('-11,-2662'),
      variableValues: {},
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.createUserStack.instNotFoundMessage).toContain('-11');
    expect(result.data.createUserStack.instNotFoundMessage).toContain('-2662');
  });

  it('can create a stack', async () => {
    const result: ExecutionResult = await gCall({
      source: createUserStackMutation('11,2662'),
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

    expect(result.data.createUserStack.stack.name).toEqual('TestRunnerStack');
    expect(result.data.createUserStack.stack.instruments.length).toEqual(2);
    createdStackId = result.data.createUserStack.stack.id;
    logger.info(`===> createdStackId=[${createdStackId}]`);
  });

  it('cannot create a stack second time', async () => {
    const result: ExecutionResult = await gCall({
      source: createUserStackMutation('11,2662'),
      variableValues: {},
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

    expect(result.data.createUserStack.errorCode).toEqual('DUPLICATE');
    expect(result.data.createUserStack.requestId).toEqual(expect.any(String));
    expect(result.data.createUserStack.requestId.length).toBeGreaterThan(0);
  });

  const deleteUserStackMutation = (stackId: string) => `
    mutation DeleteUserStacksMutation {
      deleteUserStacks(stackIds: [${stackId}]) {
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

  it('cannot delete a stack without being authorized', async () => {
    const result: ExecutionResult = await gCall({
      source: deleteUserStackMutation(createdStackId),
      graphQLErrorExpected: true
    });
    checkForbiddenError(result);
  });

  it('can delete a stack', async () => {
    const result: ExecutionResult = await gCall({
      source: deleteUserStackMutation(createdStackId),
      variableValues: {},
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.deleteUserStacks.deleteIds.length).toEqual(1);
    expect(result.data.deleteUserStacks.deleteIds[0]).toEqual(createdStackId);
  });
});
