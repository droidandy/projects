import { ExecutionResult } from 'graphql';
import { User } from '../models/user';
import { EAccessRole } from '../security/auth-checker';
import { checkForbiddenError, launchpadUserMetadata } from '../test-utils/common';
import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';

describe('The GraphQL user mutations', () => {
  beforeAll(async () => {
    await connection.create();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(() => jest.clearAllMocks());

  const createUserGQL = (fullName: string, stacks: string = '[]'): string => `
    mutation createUserGQL {
      createUser(data: { fullName: "${fullName}", tags: [], stacks: ${stacks} } ) {
        __typename
        ... on CreateUserSuccess {
          user {
            id
            userName
            email
            fullName
            bio
            avatar
            tags {
              id
            }
            instTags {
              ids
            }
            stacks {
              id
              name
              instruments { id }
            }
            hunches {
              id
            }
            achievements {
              id
            }
            followedStacks {
              id
            }
            followedHunches {
              id
            }
            followedUsers {
              id
            }
            followers {
              id
            }
            nHunches
            nStacks
            nFollowedUsers
            nFollowers
            canTrade
            huncherPercentage
          }
        }
        ... on CreateUserAlreadyExistsError {
          message
          requestId
        }
        ... on CreateInvalidInputError {
          message
          errorCode
          requestId
        }
        ... on InstNotFoundError {
          message
          requestId
        }
      }
    }`;

  const createUser = async (userName: string, stacks: string = '[]'): Promise<ExecutionResult> =>
    await gCall({
      source: createUserGQL(userName + ' smith', stacks),
      contextValue: {
        metadata: {
          role: EAccessRole.LAUNCHPAD_USER,
          token: {
            username: userName,
            email: userName + '@allofus.com'
          }
        }
      }
    });

  it('cannot create a user without being authorized', async () => {
    const result: ExecutionResult = await gCall({
      source: createUserGQL('Foo Bar'),
      graphQLErrorExpected: true
    });
    checkForbiddenError(result);
  });


  it('can create a user', async () => {
    const result = await gCall({
      source: createUserGQL('Foo Bar'),
      contextValue: {
        metadata: {
          role: EAccessRole.LAUNCHPAD_USER,
          token: {
            username: 'foobar',
            email: 'foo@bar'
          }
        }
      }
    });
    expect(result.data.createUser.user.fullName).toEqual('Foo Bar');
    expect(result.data.createUser.user.userName).toEqual('foobar');
    expect(result.data.createUser.user.email).toEqual('foo@bar');
    expect(result.data.createUser.user.tags.length).toEqual(0);
    expect(result.data.createUser.user.stacks.length).toEqual(0);
  });

  it('cannot create an already existing user', async () => {
    const result = await gCall({
      source: createUserGQL(launchpadUserMetadata.user.fullName),
      variableValues: {},
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.createUser.message).toEqual('User already exists and cannot be created');
    expect(result.data.createUser.requestId.length).toBeGreaterThan(0);
  });

  it('can add stack during user creation', async () => {
    const stacks = `[
      { name: "stack_1", instIds: [1, 2, 3] },
      { name: "stack_2", instIds: [3, 4] }
    ]`;

    const result = await createUser('stacker1', stacks);
    expect(result.data.createUser.user.stacks.length).toEqual(2);
    expect(result.data.createUser.user.stacks[0].instruments.length).toEqual(3);
    expect(result.data.createUser.user.stacks[1].instruments.length).toEqual(2);

    const dbUser = await User.findOne({ where: { userName: 'stacker1' } });
    expect(dbUser.userName).toEqual('stacker1');
  });

  it('throw error while adding stacks causes user to get rolled back', async () => {
    const stacks = `[
      { name: "bad_stack", instIds: [99999999] }
    ]`;

    const userName = 'bad_stacker';
    const result = await createUser(userName, stacks);
    /* eslint no-underscore-dangle: ["error", { "allow": ["__typename"] }]*/
    expect(result.data.createUser.__typename).toEqual('InstNotFoundError');
    expect(result.data.createUser.message.includes('given by instIds=[99999999]')).toEqual(true);
    expect(result.data.createUser.requestId).toEqual(expect.any(String));
    expect(result.data.createUser.requestId.length).toBeGreaterThan(0);
    expect(await User.findOne({ where: { userName } })).toEqual(undefined);
  });
});
