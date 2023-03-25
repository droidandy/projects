import { ExecutionResult } from 'graphql';
import { getRepository } from 'typeorm';
import { User, UserFollow } from '../models/user';
import { EAccessRole } from '../security/auth-checker';
import { launchpadUserMetadata } from '../test-utils/common';
import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';

describe('The GraphQL user follow mutations', () => {
  beforeAll(async () => {
    await connection.create();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(() => jest.clearAllMocks());

  const getNFollowers = async (id: number): Promise<number> => {
    const gql = `
      query Query {
        currentUser {
          ... on User {
            nFollowers
          }
        }
      }`;
    const result = await gCall({
      source: gql,
      contextValue: {
        metadata: {
          role: EAccessRole.LAUNCHPAD_USER,
          user: {
            id,
          }
        }
      }
    });
    return result.data.currentUser.nFollowers;
  };

  const getNFollowedUsers = async (id: number): Promise<number> => {
    const gql = `
      query Query {
        currentUser {
          ... on User {
            nFollowedUsers
          }
        }
      }`;
    const result = await gCall({
      source: gql,
      contextValue: {
        metadata: {
          role: EAccessRole.LAUNCHPAD_USER,
          user: {
            id,
          }
        }
      }
    });
    return result.data.currentUser.nFollowedUsers;
  };

  const getFollowedUsers = async (id: number, nMax?: number): Promise<User[]> => {
    const gql = `
      query Query {
        currentUser {
          ... on User {
            followedUsers ${nMax ? '(nMax: ' + nMax + ')' : ''}{
              id
              userName
            }
          }
        }
      }`;
    return (await gCall({
      source: gql,
      contextValue: {
        metadata: {
          role: EAccessRole.LAUNCHPAD_USER,
          user: {
            id,
          }
        }
      }
    })).data.currentUser.followedUsers;
  };

  const getFollowers = async (id: number, nMax?: number): Promise<User[]> => {
    const gql = `
      query Query {
        currentUser {
          ... on User {
            followers ${nMax ? '(nMax: ' + nMax + ')' : ''}{
              id
              userName
            }
          }
        }
      }`;
    return (await gCall({
      source: gql,
      contextValue: {
        metadata: {
          role: EAccessRole.LAUNCHPAD_USER,
          user: {
            id,
          }
        }
      }
    })).data.currentUser.followers;
  };


  it('can create a user follow', async () => {
    const followUser = async (followedUserId: number, getRelations: boolean = true): Promise<ExecutionResult> => {
      const gql = `
        mutation  {
          createUserFollow(followedUserId: ${followedUserId}) {
            __typename
            ... on CreateUserFollowSuccess {
              userFollow {
                id
                ${getRelations ? 'userFollowed { id userName } follower { id userName }' : ''}
              }
            }
            ... on CreateInvalidInputError {
              message
              errorCode
              requestId
            }
            ... on NotAllowedError {
              notAllowedMessage: message
            }
          }
        }`;
      return await gCall({
        source: gql,
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
    };

    let result = await followUser(1);
    expect(result.data.createUserFollow.notAllowedMessage).toEqual('User is not allowed to follow self');
    expect((await getNFollowers(1))).toEqual(0);
    expect((await getNFollowedUsers(1))).toEqual(0);
    expect((await getFollowedUsers(1))).toHaveLength(0);
    expect((await getFollowers(1))).toHaveLength(0);

    result = await followUser(2);
    expect(result.data.createUserFollow.userFollow.id).toEqual('2');
    expect(result.data.createUserFollow.userFollow.userFollowed.id).toEqual('2');
    expect(result.data.createUserFollow.userFollow.userFollowed.userName).toEqual('lshard');
    expect(result.data.createUserFollow.userFollow.follower.id).toEqual('1');
    expect(result.data.createUserFollow.userFollow.follower.userName).toEqual('jbull');
    expect((await getNFollowers(2))).toEqual(1);
    expect((await getNFollowedUsers(2))).toEqual(0);
    expect((await getNFollowers(1))).toEqual(0);
    expect((await getNFollowedUsers(1))).toEqual(1);
    expect((await getFollowedUsers(2))).toHaveLength(0);
    expect((await getFollowers(2))).toHaveLength(1);
    expect((await getFollowedUsers(1))).toHaveLength(1);
    expect((await getFollowers(1))).toHaveLength(0);

    result = await followUser(3, false);
    expect(result.data.createUserFollow.userFollow.id).toEqual('3');
    expect(result.data.createUserFollow.userFollow.userFollowed).toEqual(undefined);
    expect(result.data.createUserFollow.userFollow.follower).toEqual(undefined);
    expect((await getNFollowers(3))).toEqual(1);
    expect((await getNFollowedUsers(3))).toEqual(0);
    expect((await getNFollowers(2))).toEqual(1);
    expect((await getNFollowedUsers(2))).toEqual(0);
    expect((await getNFollowers(1))).toEqual(0);
    expect((await getNFollowedUsers(1))).toEqual(2);
    expect((await getFollowedUsers(3))).toHaveLength(0);
    expect((await getFollowedUsers(2))).toHaveLength(0);
    expect((await getFollowedUsers(1))).toHaveLength(2);
    expect((await getFollowedUsers(1)).map(u => u.id).sort()).toEqual(['2', '3']);
    expect((await getFollowers(1))).toHaveLength(0);
    expect((await getFollowers(1, 1))).toHaveLength(0);
    expect((await getFollowedUsers(1, 1))).toHaveLength(1);
    expect((await getFollowedUsers(2))).toHaveLength(0);
    expect((await getFollowedUsers(2, 1))).toHaveLength(0);
    expect((await getFollowedUsers(3))).toHaveLength(0);
    expect((await getFollowedUsers(3, 1))).toHaveLength(0);
    expect((await getFollowers(2)).map(u => u.id)).toEqual(['1']);
    expect((await getFollowers(3)).map(u => u.id)).toEqual(['1']);
    expect((await getFollowers(2, 1)).map(u => u.id)).toEqual(['1']);
    expect((await getFollowers(3, 1)).map(u => u.id)).toEqual(['1']);

    result = await followUser(2);
    expect(result.data.createUserFollow.errorCode).toEqual('DUPLICATE');
    expect(result.data.createUserFollow.requestId).toEqual(expect.any(String));
    expect(result.data.createUserFollow.requestId.length).toBeGreaterThan(0);
  });

  const unfollowUser = async (ids: string): Promise<ExecutionResult> => {
    const gql = `
      mutation {
        deleteUserFollows(userFollowIds: ${ids}) {
          ... on DeleteSuccess {
            deleteIds
          }
        }
      }`;
    return await gCall({
      source: gql,
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });
  };

  it('can delete a user follow', async () => {
    const result = await unfollowUser('[2,3,4000,5000]');
    expect(result.data.deleteUserFollows.deleteIds).toEqual(['2', '3']);

    expect((await getNFollowers(2))).toEqual(0);
    expect((await getNFollowedUsers(2))).toEqual(0);
    expect((await getNFollowers(3))).toEqual(0);
    expect((await getNFollowedUsers(3))).toEqual(0);
    expect((await getNFollowers(1))).toEqual(0);
    expect((await getNFollowedUsers(1))).toEqual(0);
    expect((await getFollowedUsers(1))).toHaveLength(0);
    expect((await getFollowers(1))).toHaveLength(0);
    expect((await getFollowedUsers(2))).toHaveLength(0);
    expect((await getFollowers(2))).toHaveLength(0);
    expect((await getFollowedUsers(3))).toHaveLength(0);
    expect((await getFollowers(3))).toHaveLength(0);
    expect(await getRepository(UserFollow).findOne({
      where: {
        userFollowedId: 3,
        userFollowerId: 1,
      }
    })).toEqual(undefined);
    expect(await getRepository(UserFollow).findOne({
      where: {
        userFollowedId: 2,
        userFollowerId: 1,
      }
    })).toEqual(undefined);
  });

  it('can create a user follow with no success listeners', async () => {
    const followUser = async (followedUserId: number, getRelations: boolean = true): Promise<ExecutionResult> => {
      const gql = `
        mutation  {
          createUserFollow(followedUserId: ${followedUserId}) {
            ... on NotAllowedError {
              message
            }
          }
        }`;
      return await gCall({
        source: gql,
        contextValue: {
          metadata: launchpadUserMetadata
        }
      });
    };

    let result = await followUser(2);
    expect(result.data.createUserFollow).toEqual({});

    const follow = await getRepository(UserFollow).findOne({
      where: {
        userFollowedId: 2,
        userFollowerId: 1,
      }
    });
    expect(follow.id > BigInt(0)).toEqual(true);

    result = await unfollowUser(follow.id.toString());
    expect(result.data.deleteUserFollows.deleteIds).toEqual([follow.id.toString()]);

    expect(await getRepository(UserFollow).findOne({
      where: {
        userFollowedId: 2,
        userFollowerId: 1,
      }
    })).toEqual(undefined);
  });
});
