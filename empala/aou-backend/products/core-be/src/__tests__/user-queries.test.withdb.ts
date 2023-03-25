import { ExecutionResult } from 'graphql';
import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';
import { EAccessRole } from '../security/auth-checker';
import { checkForbiddenError, getPriceForInstId, launchpadUserMetadata } from '../test-utils/common';

describe('The GraphQL user queries', () => {
  beforeAll(async () => {
    await connection.create();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(() => jest.clearAllMocks());

  it('can return user achievements', async () => {
    const result: ExecutionResult = await gCall({
      source: `
        query Query($nMax: Int!) {
          currentUser {
            ... on User {
              achievements(nMax: $nMax) {
                name
                level
              }
            }
          }
        }
        `,
      variableValues: {
        nMax: 3
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

    console.log('##### ', result.data.currentUser)

    expect(result.data.currentUser.achievements.length).toEqual(2);
    expect(result.data.currentUser.achievements[0].name).toEqual('Tagger');
  });

  it('can return stacks for the current user', async () => {
    const createQuery = (subquery: string, nMaxInsts?: number) => `
      query Query ($nMax: Int!) {
        currentUser {
          ... on User {
            stacks(nMax: $nMax) {
              id
              name
              instruments ${nMaxInsts ? '(nMax: ' + nMaxInsts + ')' : ''} {
                symbol
                ${subquery}
              }
            }
          }
        }
      }
      `;
    let result: ExecutionResult = await gCall({
      source: createQuery(''),
      variableValues: {
        nMax: 3
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.currentUser.stacks.length).toEqual(2);
    expect(result.data.currentUser.stacks[0].instruments.length > 1).toBeTruthy();

    result = await gCall({
      source: createQuery('themes { id name }'),
      variableValues: {
        nMax: 3
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.currentUser.stacks.length).toEqual(2);
    expect(result.data.currentUser.stacks[0].instruments.length > 1).toBeTruthy();
    expect(result.data.currentUser.stacks[0].instruments[0].themes.length > 1).toBeTruthy();

    result = await gCall({
      source: createQuery('themes(nMax: 1) { id name }'),
      variableValues: {
        nMax: 3
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.currentUser.stacks.length).toEqual(2);
    expect(result.data.currentUser.stacks[0].instruments.length > 1).toBeTruthy();
    expect(result.data.currentUser.stacks[0].instruments[0].themes).toHaveLength(1);

    result = await gCall({
      source: createQuery('', 1),
      variableValues: {
        nMax: 3
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.currentUser.stacks.length).toEqual(2);
    expect(result.data.currentUser.stacks[0].instruments).toHaveLength(1);

    result = await gCall({
      source: createQuery('themes { id name }', 1),
      variableValues: {
        nMax: 3
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.currentUser.stacks.length).toEqual(2);
    expect(result.data.currentUser.stacks[0].instruments).toHaveLength(1);
    expect(result.data.currentUser.stacks[0].instruments[0].themes.length > 1).toBeTruthy();

    result = await gCall({
      source: createQuery('themes(nMax: 1) { id name }', 1),
      variableValues: {
        nMax: 3
      },
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.currentUser.stacks.length).toEqual(2);
    expect(result.data.currentUser.stacks[0].instruments).toHaveLength(1);
    expect(result.data.currentUser.stacks[0].instruments[0].themes).toHaveLength(1);
  });

  it('can return stacks for another user', async () => {
    const result: ExecutionResult = await gCall({
      source: `
        query Query {
          currentUser {
            ... on User {
              id
              email
              userName
              stacks {
                name
                instruments {
                  symbol
                }
              }
            }
          }
        }
        `,
      contextValue: {
        metadata: {
          role: EAccessRole.LAUNCHPAD_USER,
          user: {
            id: 2,
          },
          token: {
            username: 'lucy'
          }
        }
      }
    });
    expect(result.data.currentUser.id).toEqual('2');
    expect(result.data.currentUser.stacks.length).toEqual(3);
    result.data.currentUser.stacks.forEach((stack: any) => expect(stack.name).toContain('Lucy'));
  });

  it('can return nStacks for another user', async () => {
    const result: ExecutionResult = await gCall({
      source: `
        query Query {
          currentUser {
            ... on User {
              nStacks
              id
            }
          }
        }
        `,
      contextValue: {
        metadata: {
          role: EAccessRole.LAUNCHPAD_USER,
          user: {
            id: 2,
          },
          token: {
            username: 'lucy'
          }
        }
      }
    });
    expect(result.data.currentUser.id).toEqual('2');
    expect(result.data.currentUser.nStacks).toEqual(3);
  });

  describe('can return subqueries of currentUser->stacks', () => {
    const runQuery = async (subquery: string) => await gCall({
      source: `
      query Query {
        currentUser {
          ... on User {
            id
            stacks {
              id
              name
              ${subquery}
            }
          }
        }
      }`,
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

    it('can return currentUser->stacks->instruments->themes subquery', async () => {
      let result = await runQuery('instruments { symbol themes { id name } }');
      expect(result.data.currentUser.stacks[0].instruments.length > 1).toEqual(true);
      expect(result.data.currentUser.stacks[0].instruments[0].themes.length > 1).toEqual(true);

      result = await runQuery('instruments(nMax: 1) { symbol themes(nMax: 1) { id name } }');
      expect(result.data.currentUser.stacks[0].instruments.length).toEqual(1);
      expect(result.data.currentUser.stacks[0].instruments[0].themes.length).toEqual(1);
    });


    it('can return currentUser->stacks->instruments->stacks subquery', async () => {
      let result = await runQuery('instruments { id symbol stacks { id name } }');
      expect(result.data.currentUser.stacks[0].instruments.length > 1).toEqual(true);
      expect(result.data.currentUser.stacks[0].instruments[0].stacks.length > 1).toEqual(true);

      result = await runQuery('instruments(nMax: 1) { symbol stacks(nMax: 1) { id name } }');
      expect(result.data.currentUser.stacks[0].instruments.length).toEqual(1);
      expect(result.data.currentUser.stacks[0].instruments[0].stacks.length).toEqual(1);
    });

    it('can return currentUser->stacks->instruments->hunches subquery', async () => {
      let result = await runQuery('instruments { symbol hunches { id } }');
      expect(result.data.currentUser.stacks[0].instruments.length > 1).toEqual(true);
      expect(result.data.currentUser.stacks[0].instruments[0].hunches.length).toEqual(1);

      result = await runQuery('instruments(nMax: 1) { symbol hunches(nMax: 1) { id } }');
      expect(result.data.currentUser.stacks[0].instruments.length).toEqual(1);
      expect(result.data.currentUser.stacks[0].instruments[0].hunches.length).toEqual(1);
    });
  });


  describe('can return currentUser->hunches and its subqueries', () => {
    const runQuery = async (hunchesQuery: string, hunchesFields: string) => await gCall({
      source: `
        query Query {
          currentUser {
            ... on User {
              ${hunchesQuery}
                ${hunchesFields}
            }
          }
        }`,
      contextValue: { metadata: launchpadUserMetadata }
    });

    it('can return currentUser->hunches', async () => {
      let result = await runQuery('hunches', '{ id targetPrice }');
      expect(result.data.currentUser.hunches.length).toEqual(2);
      expect(result.data.currentUser.hunches.map((h: any) => h.targetPrice)).toEqual([0.8, 0.1]);

      result = await runQuery('hunches (nMax: 1)', '{ id targetPrice }');
      expect(result.data.currentUser.hunches.length).toEqual(1);
      expect(result.data.currentUser.hunches.map((h: any) => h.targetPrice)).toEqual([0.8]);
    });

    it('can return currentUser->hunches->instrument', async () => {
      let result = await runQuery('hunches', '{ id currentPrice instrument { id symbol currentPrice yesterdayClosePrice askCurrentPrice bidCurrentPrice}}');
      expect(result.data.currentUser.hunches.length).toEqual(2);
      expect(result.data.currentUser.hunches[0].instrument.symbol).toEqual('AAPL');

      const expectedPrice = Number(await getPriceForInstId(result.data.currentUser.hunches[0].instrument.id));
      expect(result.data.currentUser.hunches[0].currentPrice).toEqual(expectedPrice);
      expect(result.data.currentUser.hunches[0].currentPrice).toEqual(result.data.currentUser.hunches[0].instrument.currentPrice);
      expect(result.data.currentUser.hunches[0].instrument.yesterdayClosePrice).toEqual(expectedPrice);

      const ask = result.data.currentUser.hunches[0].instrument.askCurrentPrice;
      const bid = result.data.currentUser.hunches[0].instrument.bidCurrentPrice;
      expect(ask).toBeGreaterThan(expectedPrice);
      expect(ask).toBeLessThanOrEqual(expectedPrice + expectedPrice * 0.05);
      expect(bid).toBeLessThan(expectedPrice);
      expect(bid).toBeGreaterThanOrEqual(expectedPrice - expectedPrice * 0.05);

      result = await runQuery('hunches (nMax: 1)', '{ id instrument { symbol }}');
      expect(result.data.currentUser.hunches.length).toEqual(1);
      expect(result.data.currentUser.hunches[0].instrument.symbol).toEqual('AAPL');

      // currentUser->hunches->instrument->themes
      result = await runQuery('hunches (nMax: 1)', '{ id instrument { symbol themes { name }}}');
      expect(result.data.currentUser.hunches.length).toEqual(1);
      expect(result.data.currentUser.hunches[0].instrument.symbol).toEqual('AAPL');
      expect(result.data.currentUser.hunches[0].instrument.themes.length > 1).toEqual(true);
    });

    it('can return currentUser->nHunches', async () => {
      const result = await runQuery('nHunches', '');
      expect(result.data.currentUser.nHunches).toEqual(2);
    });
  });


  const userExists = `
    query Query ($email: String!) {
      userExists(email: $email) {
        ... on UserExists {
          exists
        }
      }
    }
    `;

  it('can check if a user exists by email', async () => {
    const result: ExecutionResult = await gCall({
      source: userExists,
      variableValues: {
        email: 'jason.bull@coolmail.com'
      }
    });
    expect(result.data.userExists.exists).toEqual(true);
  });

  it('can check if a user does not exist by email', async () => {
    const result: ExecutionResult = await gCall({
      source: userExists,
      variableValues: {
        email: 'xxxx'
      }
    });
    expect(result.data.userExists.exists).toEqual(false);
  });

  const currentUserQuery = `
    query Query {
      currentUser {
        ... on User {
          id
          userName
          email
          fullName
        }
      }
    }
    `;

  it('cannot return current user without being authorized', async () => {
    const result: ExecutionResult = await gCall({
      source: currentUserQuery,
      graphQLErrorExpected: true
    });
    checkForbiddenError(result);
  });

  it('can return current user', async () => {
    const result: ExecutionResult = await gCall({
      source: currentUserQuery,
      variableValues: {},
      contextValue: {
        metadata: launchpadUserMetadata,
      }
    });
    expect(result.data.currentUser.id).toEqual(launchpadUserMetadata.user.id.toString());
    expect(result.data.currentUser.fullName).toEqual(launchpadUserMetadata.user.fullName);
    expect(result.data.currentUser.userName).toEqual(launchpadUserMetadata.user.userName);
    expect(result.data.currentUser.email).toEqual(launchpadUserMetadata.token.email);
  });

  it('cannot return current user for yet nonregistered user', async () => {
    const result: ExecutionResult = await gCall({
      source: currentUserQuery,
      contextValue: {
        metadata: {
          role: EAccessRole.LAUNCHPAD_USER,
          token: {
            username: 'nonregistered',
            email: 'nonregistered@fakemail.com'
          }
        },
      },
      graphQLErrorExpected: true
    });
    checkForbiddenError(result);
    expect(result.errors[0].message).toContain('call createUser');
  });

  const topUsersQuery = (subquery: string = '', nMax?: number) => `
    query Query {
      topUsers ${nMax ? '(nMax: ' + nMax + ')' : ''} {
          ... on TopUsers {
            users {
              id
              userName
              email
              ${subquery}
            }
          }
        }
      }`;

  it('can return topUsers', async () => {
    let result: ExecutionResult = await gCall({
      source: topUsersQuery(),
    });
    expect(result.data.topUsers.users.length > 1).toBeTruthy();

    result = await gCall({
      source: topUsersQuery('', 2),
    });
    expect(result.data.topUsers.users).toHaveLength(2);

  });

  it('return topUsers with user-dependent info related to each user, not for current user', async () => {
    const subquery = 'stacks { id } hunches { id } followedUsers { id } followers { id } nStacks nHunches nFollowedUsers nFollowers';
    const result: ExecutionResult = await gCall({
      source: topUsersQuery(subquery, 2),
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
    expect(result.data.topUsers.users).toHaveLength(2);
    const indNonCurrentUser = result.data.topUsers.users[0].id.toString() === launchpadUserMetadata.user.id.toString() ? 1 : 0;
    const nonCurrentUser = result.data.topUsers.users[indNonCurrentUser];
    const nonCurrentUserResult: ExecutionResult = await gCall({
      source: `
      query Query {
        currentUser {
          ... on User {
            id
            userName
            email
            ${subquery}
          }
        }
      }`,
      contextValue: {
        metadata: {
          role: EAccessRole.LAUNCHPAD_USER,
          user: {
            id: nonCurrentUser.id,
            userName: nonCurrentUser.userName
          },
          token: {
            username: nonCurrentUser.userName,
            email: nonCurrentUser.email
          }
        }
      }
    });
    expect(nonCurrentUserResult.data.currentUser).toMatchObject(nonCurrentUser);
  });

  it('return topUsers with user-dependent info in deep subqueries related to each user', async () => {
    const subquery =
      ' stacks { id instruments { symbol themes { id } hunches { id } } }' +
      ' hunches { id instrument { symbol themes { id } stacks { id } } } nStacks nHunches ';
    const result: ExecutionResult = await gCall({
      source: topUsersQuery(subquery, 3)
    });
    expect(result.data.topUsers.users).toHaveLength(3);
    for (let indUser = 0; indUser < 3; indUser++) {
      const currentUser = result.data.topUsers.users[indUser];
      const currentUserResult: ExecutionResult = await gCall({
        source: `
        query Query {
          currentUser {
            ... on User {
              id
              userName
              email
              ${subquery}
            }
          }
        }`,
        contextValue: {
          metadata: {
            role: EAccessRole.LAUNCHPAD_USER,
            user: {
              id: currentUser.id,
              userName: currentUser.userName
            },
            token: {
              username: currentUser.userName,
              email: currentUser.email
            }
          }
        }
      });
      expect(currentUserResult.data.currentUser).toMatchObject(currentUser);
    }
  });
});
