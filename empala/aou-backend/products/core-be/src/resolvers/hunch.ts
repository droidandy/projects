import {
  Ctx, Resolver, Arg, Mutation, UseMiddleware, ID, Authorized, FieldResolver, Root,
} from 'type-graphql';
import { getRepository } from 'typeorm';
import { Hunch } from '../models/hunch';
import { Instrument } from '../models/instrument';
import { CreateUserHunchResult, CreateUserHunchSuccess } from '../results/create-user-hunch';
import { DeleteErrorHandler, CreateErrorHandler } from '../utils/middlewares/error-handler';
import { CreateHunchInput } from '../inputs/create-hunch';
import { DeleteResult, DeleteSuccess } from '../results/delete';

import { InstNotFoundError } from '../errors/inst-not-found';
import { EAccessRole } from '../security/auth-checker';
import { InstrumentResolver } from './instrument';

@Resolver(Hunch)
export class HunchResolver {
  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => CreateUserHunchResult)
  @UseMiddleware(CreateErrorHandler)
  public async createUserHunch(
    @Ctx() ctx: any,
      @Arg('data', () => CreateHunchInput, { nullable: false }) data: CreateHunchInput,
  ): Promise<typeof CreateUserHunchResult> {
    let result: typeof CreateUserHunchResult = null;

    if ((await getRepository(Instrument).count({ where: { id: data.instId } })) === 0) {
      result = new InstNotFoundError(`Instrument with ID given by instId=${data.instId} does not exist`, ctx.requestId);
      return result;
    }

    const newHunch = new Hunch();
    newHunch.description = data.description;
    newHunch.instrument = Object.assign(new Instrument(), { id: data.instId });
    newHunch.targetPrice = data.targetPrice;
    newHunch.byDate = data.byDate;
    newHunch.user = ctx.metadata.user;

    const hunchRepo = getRepository(Hunch);
    const savedHunch = await hunchRepo.save(newHunch);

    result = new CreateUserHunchSuccess();
    result.hunch = savedHunch;
    return result;
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => DeleteResult)
  @UseMiddleware(DeleteErrorHandler)
  public async deleteUserHunches(@Arg('hunchIds', () => [ID], { nullable: false }) hunchIds: BigInt[]): Promise<typeof DeleteResult> {
    const hunchRepo = getRepository(Hunch);
    const toDeleteHunches = await hunchRepo.findByIds(hunchIds.map(String));
    const deleteIds = toDeleteHunches.map((hunch) => hunch.id);
    await hunchRepo.remove(toDeleteHunches);
    const result = new DeleteSuccess();
    result.deleteIds = deleteIds;
    return result;
  }

  @FieldResolver()
  public async currentPrice(@Root() hunch: Hunch): Promise<number | null> {
    return InstrumentResolver.getYesterdayClosePrice(hunch.instId);
  }
}
