import {
  Resolver, Mutation, Arg, UseMiddleware, Ctx, ID, FieldResolver, Root, Int, Authorized,
} from 'type-graphql';
import {
  EntityManager, getManager, getRepository, In,
} from 'typeorm';
import { ResolveTree } from 'graphql-parse-resolve-info';
import { Stack } from '../models/stack';
import { Instrument } from '../models/instrument';
import { CreateStackInput } from '../inputs/create-stack';
import { CreateUserStackResult, CreateUserStackSuccess } from '../results/create-user-stack';
import { DeleteErrorHandler, CreateErrorHandler } from '../utils/middlewares/error-handler';
import { DeleteResult, DeleteSuccess } from '../results/delete';
import { Fields } from '../utils/graphql/common';
import { InstNotFoundError } from '../errors/inst-not-found';
import { EAccessRole } from '../security/auth-checker';

@Resolver(() => Stack)
export class StackResolver {
  public static async doCreateUserStack(
    manager: EntityManager,
    name: string,
    instIds: BigInt[],
    userId: BigInt,
    requestId: string,
  ): Promise<Stack | InstNotFoundError> {
    const query = `SELECT inst_id FROM UNNEST(ARRAY[${instIds}]) AS inst_id WHERE inst_id NOT IN (SELECT id FROM instruments.inst)`;
    const missingInstIdsRaw = await manager.query(query);
    if (missingInstIdsRaw.length === 0) {
      const newStack = new Stack();
      newStack.name = name.trim();
      newStack.instruments = instIds.map((id) => Object.assign(new Instrument(), { id }));
      newStack.userId = userId;
      const savedStack = await manager.save(newStack);
      savedStack.instruments = null; // setting to null will force DB query for instruments in field resolver if instruments are requested in GQL query
      return savedStack;
    }
    const error = new InstNotFoundError(
      `Instruments with IDs given by instIds=[${missingInstIdsRaw.map((inst: any) => inst.inst_id)}] do not exist in the system`,
      requestId,
    );
    return error;
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => CreateUserStackResult)
  @UseMiddleware(CreateErrorHandler)
  public async createUserStack(
    @Ctx() ctx: any,
      @Arg('data', () => CreateStackInput, { nullable: false }) data: CreateStackInput,
  ): Promise<typeof CreateUserStackResult> {
    const result = await StackResolver.doCreateUserStack(getManager(), data.name, data.instIds, BigInt(ctx.metadata.user.id), ctx.requestId);
    if (result instanceof Stack) {
      const success = new CreateUserStackSuccess();
      success.stack = result;
      return success;
    } return result;
  }

  @Authorized([EAccessRole.LAUNCHPAD_USER])
  @Mutation(() => DeleteResult)
  @UseMiddleware(DeleteErrorHandler)
  public async deleteUserStacks(@Arg('stackIds', () => [ID], { nullable: false }) stackIds: BigInt[]): Promise<typeof DeleteResult> {
    const stackRepo = getRepository(Stack);

    //
    // we have to use repo.remove(),
    // because of the relations between stack -> instruments (stack_inst)
    // so that data is removed from stack_inst table too
    //

    const toDeleteStacks = await stackRepo.find({
      where: {
        id: In(Array.from(stackIds.map(String))),
      },
      relations: ['instruments'],
    });
    const deleteIds = toDeleteStacks.map((stack) => stack.id);
    await stackRepo.remove(toDeleteStacks);

    const result = new DeleteSuccess();
    result.deleteIds = deleteIds;
    return result;
  }

  @FieldResolver()
  public async instruments(
    @Fields() fields: ResolveTree,
      @Root() stack: Stack,
      @Arg('nMax', () => Int, { nullable: true }) nMax?: number,
  ): Promise<Instrument[]> {
    if (stack.instruments) {
      return stack.instruments;
    }
    const instIdsRaw = await getManager().createQueryBuilder()
      .select('inst_id')
      .from('stack_inst', 'stack_inst')
      .where('stack_inst.stack_id = :stackId', { stackId: stack.id })
      .skip(0)
      .limit(nMax)
      .getRawMany();
    const relations = [];
    if ('themes' in fields.fieldsByTypeName.Instrument
        && !('nMax' in fields.fieldsByTypeName.Instrument.themes.args)) { relations.push('themes'); }
    if ('feeds' in fields.fieldsByTypeName.Instrument) relations.push('instrumentFeeds');
    if ('exchange' in fields.fieldsByTypeName.Instrument) relations.push('exchange');
    return getRepository(Instrument).find({
      where: { id: In(Array.from(instIdsRaw.map((elem) => String(elem.inst_id)))) },
      relations,
    });
  }
}
