import {
  Ctx, Resolver, Query, Mutation, FieldResolver, Root, Arg, Int, ID, UseMiddleware, Authorized,
} from 'type-graphql';
import { getManager, getRepository, In } from 'typeorm';
import { ResolveTree } from 'graphql-parse-resolve-info';
import { User, UserFollow } from '../models/user';
import { UserExists, UserExistsResult } from '../results/user-exists';
import { CreateUserResult, CreateUserSuccess } from '../results/create-user';
import { Tags, InstTags } from '../models/inst-tags';
import { Stack } from '../models/stack';
import { Hunch } from '../models/hunch';
import { Achievement } from '../models/achievement';
import { CreateUserInput } from '../inputs/create-user';
import { CreateUserAlreadyExistsError } from '../errors/create-user-already-exists';
import { CreateErrorHandler, DeleteErrorHandler, TransactionErrorHandler } from '../utils/middlewares/error-handler';
import { CurrentUserResult } from '../results/current-user';
import TransactionError, { Fields } from '../utils/graphql/common';
import { TopUsers, TopUsersResult } from '../results/top-users';
import { CreateUserFollowResult, CreateUserFollowSuccess } from '../results/create-user-follow';
import { DeleteResult, DeleteSuccess } from '../results/delete';
import { EAccessRole } from '../security/auth-checker';
import { NotAllowedError } from '../errors/not-allowed';

import { logger } from '../../../utils/src/logger';
import { StackResolver } from './stack';

@Resolver(() => User)
export class UserResolver {
  @FieldResolver()
  public async tags(@Root() user: User, @Arg('nMax', () => Int, { nullable: true }) nMax?: number): Promise<Tags[]> {
    return getRepository(Tags).find({
      where: { userId: user.id },
      skip: 0,
      take: nMax,
    });
  }

  @FieldResolver()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async instTags(@Root() user: User, @Arg('nMax', () => Int, { nullable: true }) nMax?: number): Promise<InstTags[]> {
    return [];
  }

  @FieldResolver()
  public async stacks(@Fields() fields: ResolveTree, @Root() user: User, @Arg('nMax', () => Int, { nullable: true }) nMax?: number): Promise<Stack[]> {
    const relations = [];
    if ('instruments' in fields.fieldsByTypeName.Stack && !('nMax' in fields.fieldsByTypeName.Stack.instruments.args)) relations.push('instruments');
    return getRepository(Stack)
      .find({
        where: {
          userId: user.id,
        },
        skip: 0,
        take: nMax,
        relations,
      });
  }

  @FieldResolver()
  public async hunches(@Fields() fields: ResolveTree, @Root() user: User, @Arg('nMax', () => Int, { nullable: true }) nMax?: number): Promise<Hunch[]> {
    const relations = [];
    if ('instrument' in fields.fieldsByTypeName.Hunch) relations.push('instrument');
    return getRepository(Hunch)
      .find({
        where: {
          userId: user.id,
        },
        skip: 0,
        take: nMax,
        relations,
      });
  }

  @FieldResolver()
  public async achievements(@Root() user: User, @Arg('nMax', () => Int, { nullable: true }) nMax?: number): Promise<Achievement[]> {
    const achievementIdsRaw = await getManager().createQueryBuilder()
      .select('achievement_id')
      .from('userachievement', 'userachievement')
      .where('userachievement.user_id = :userId', { userId: user.id })
      .skip(0)
      .limit(nMax)
      .getRawMany();

    return getRepository(Achievement).find({
      where: { id: In(Array.from(achievementIdsRaw.map((elem) => String(elem.achievement_id)))) },
    });
  }

  @FieldResolver()
  public async nHunches(@Root() user: User): Promise<number> {
    return getRepository(Hunch).count({ where: `user_id = ${user.id}` });
  }

  @FieldResolver()
  public async nStacks(@Root() user: User): Promise<number> {
    return getRepository(Stack).count({ where: `user_id = ${user.id}` });
  }

  @FieldResolver()
  public async nFollowers(@Root() user: User): Promise<number> {
    return getRepository(UserFollow).count({ where: `user_followed_id = ${user.id}` });
  }

  @FieldResolver()
  public async nFollowedUsers(@Root() user: User): Promise<number> {
    return getRepository(UserFollow).count({ where: `user_follower_id = ${user.id}` });
  }

  @FieldResolver()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async followedStacks(@Root() user: User, @Arg('nMax', () => Int, { nullable: true }) nMax?: number): Promise<Stack[]> {
    return [];
  }

  @FieldResolver()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async followedHunches(@Root() user: User, @Arg('nMax', () => Int, { nullable: true }) nMax?: number): Promise<Hunch[]> {
    return [];
  }

  @FieldResolver()
  public async followedUsers(@Root() user: User, @Arg('nMax', () => Int, { nullable: true }) nMax?: number): Promise<User[]> {
    const follows = await getRepository(UserFollow).find({
      where: { userFollowerId: user.id },
      take: nMax,
      relations: ['userFollowed'],
    });
    return follows.map((f) => f.userFollowed);
  }

  @FieldResolver()
  public async followers(@Root() user: User, @Arg('nMax', () => Int, { nullable: true }) nMax?: number): Promise<User[]> {
    const follows = await getRepository(UserFollow).find({
      where: { userFollowedId: user.id },
      take: nMax,
      relations: ['follower'],
    });
    return follows.map((f) => f.follower);
  }

  @FieldResolver()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async canTrade(@Root() user: User): Promise<boolean> {
    return false;
  }

  @FieldResolver()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async huncherPercentage(@Root() user: User): Promise<number> {
    return 0.0;
  }

  @Query(() => TopUsersResult, { description: 'NO AUTH - AOU-376->AOU-80' })
  public async topUsers(
    @Arg('nMax', () => Int, { nullable: true }) nMax?: number,
  ): Promise<typeof TopUsersResult> {
    const result = new TopUsers();
    result.users = await User.find({ skip: 0, take: nMax });
    return result;
  }

  @Query(() => UserExistsResult, { description: 'NO AUTH - AOU-472 -> AOU-64' })
  public async userExists(@Arg('email', { nullable: false }) email: string): Promise<typeof UserExistsResult> {
    const foundUser = await getRepository(User).createQueryBuilder('user')
      .select(['user.id'])
      .where('user.email = :email', { email })
      .getOne();
    const result = new UserExists();
    result.exists = !!foundUser;
    return result;
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Query(() => CurrentUserResult)
  public async currentUser(@Ctx() ctx: any): Promise<typeof CurrentUserResult> {
    return User.getRepository().findOne({ where: { id: ctx.metadata.user.id } });
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER_TO_BE_CREATED])
  @Mutation(() => CreateUserResult, { description: 'NO AUTH - AOU-412 -> FE AOU-64' })
  @UseMiddleware(CreateErrorHandler, TransactionErrorHandler)
  public async createUser(
    @Ctx() ctx: any,
      @Arg('data', () => CreateUserInput, { nullable: false }) data: CreateUserInput,
  ): Promise<typeof CreateUserResult> {
    const newUser: User = new User();

    newUser.userCognitoId = '';
    newUser.fullName = data.fullName;
    newUser.avatar = data.avatar || '';
    newUser.bio = data.bio || '';

    // get info from token
    if (ctx.metadata.user) {
      const createUserAlreadyExistsError = new CreateUserAlreadyExistsError('User already exists and cannot be created', ctx.requestId);
      return createUserAlreadyExistsError;
    }
    const { username, email } = ctx.metadata.token;

    let createdUser: User;
    await getManager().transaction(async (transactionManager) => {
      // User
      newUser.userName = username;
      newUser.email = email;

      createdUser = await transactionManager.save(newUser);

      // Stacks
      // eslint-disable-next-line no-restricted-syntax
      for (const stack of data.stacks) {
        // eslint-disable-next-line no-await-in-loop
        const stackCreationResult = await StackResolver.doCreateUserStack(transactionManager, stack.name, stack.instIds, createdUser.id, ctx.requestId);
        if (!(stackCreationResult instanceof Stack)) throw new TransactionError(stackCreationResult);
      }

      // Tags
      /*
      for (const tag of data.tags) {
        for (const themeId of tag.themeIds) {
          const newTag: Tags = new Tags();
          newTag.instId = tag.instId;
          newTag.userId = createdUser.id;
          newTag.themeId = themeId;
          const createdTag = await Tags.save(newTag);
        }
      }
      */
    });

    const result = new CreateUserSuccess();
    result.user = createdUser;
    return result;
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => CreateUserFollowResult, { description: 'AOU-366 -> AOU-532' })
  @UseMiddleware(CreateErrorHandler)
  public async createUserFollow(
    @Ctx() ctx: any,
      @Fields() fields: ResolveTree,
      @Arg('followedUserId', () => ID) followedUserId: BigInt,
  ): Promise<typeof CreateUserFollowResult> {
    if (ctx.metadata.user.id.toString() === followedUserId.toString()) {
      const err = new NotAllowedError('User is not allowed to follow self', ctx.requestId);
      logger.error(`${err.message}. user id: ${ctx.metadata.user.id}`);
      return err;
    }

    const newFollow = new UserFollow();
    newFollow.userFollowedId = followedUserId;
    newFollow.userFollowerId = ctx.metadata.user.id;
    let createdFollow = await UserFollow.save(newFollow);

    // If follower or userFollowed is requested, we need to re-query the DB to get those relations populated
    const relations = [];
    const userFollowFields = fields.fieldsByTypeName.CreateUserFollowSuccess?.userFollow.fieldsByTypeName.UserFollow;
    if (userFollowFields?.follower) relations.push('follower');
    if (userFollowFields?.userFollowed) relations.push('userFollowed');
    if (relations.length > 0) {
      createdFollow = await getRepository(UserFollow).findOne({
        where: { id: createdFollow.id },
        relations,
      });
    }

    const result = new CreateUserFollowSuccess();
    result.userFollow = createdFollow;
    return result;
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => DeleteResult, { description: 'AOU-366 -> AOU-532' })
  @UseMiddleware(DeleteErrorHandler)
  public async deleteUserFollows(
    @Ctx() ctx: any,
      @Fields() fields: ResolveTree,
      @Arg('userFollowIds', () => [ID]) userFollowIds: BigInt[],
  ): Promise<typeof DeleteResult> {
    const repo = getRepository(UserFollow);
    const toDelete = await repo.findByIds(userFollowIds.map(String));
    const deleteIds = toDelete.map((follow) => follow.id);
    await repo.remove(toDelete);
    const result = new DeleteSuccess();
    result.deleteIds = deleteIds;
    return result;
  }
}
