import {
  Resolver, Query, Arg, Int, FieldResolver, Root,
} from 'type-graphql';
import { getManager, getRepository, In } from 'typeorm';
import { ResolveTree } from 'graphql-parse-resolve-info';
import { CommStacks, CommStacksResult } from '../results/comm-stack';
import { CommStack } from '../models/comm-stack';
import { Fields } from '../utils/graphql/common';
import { Instrument } from '../models/instrument';

@Resolver(CommStack)
export class CommStackResolver {
  @Query(() => CommStacksResult, { description: 'NO AUTH - AOU-362, AOU-411 -> AOU-78' })
  public async communityStacks(
    @Fields() fields: ResolveTree,
      @Arg('nMax', () => Int, { nullable: true }) nMax?: number,
  ): Promise<typeof CommStacksResult> {
    const result = new CommStacks();
    const commStackFields = fields.fieldsByTypeName.CommStacks.commStacks.fieldsByTypeName.CommStack;
    const relations = [];
    if ('instruments' in commStackFields && !('nMax' in commStackFields.instruments.args)) relations.push('instruments');
    result.commStacks = await getRepository(CommStack).find({
      skip: 0,
      take: nMax,
      relations,
    });
    return result;
  }

  @FieldResolver()
  public async instruments(
    @Fields() fields: ResolveTree,
      @Root() commStack: CommStack,
      @Arg('nMax', () => Int, { nullable: true }) nMax?: number,
  ): Promise<Instrument[]> {
    if (commStack.instruments) {
      return commStack.instruments;
    }
    const instIdsRaw = await getManager().createQueryBuilder()
      .select('inst_id')
      .from('commstack_inst', 'commstack_inst')
      .where('commstack_inst.commstack_id = :commstackId', { commstackId: commStack.id })
      .skip(0)
      .limit(nMax)
      .getRawMany();
    const relations = [];
    if ('themes' in fields.fieldsByTypeName.Instrument
          && !('nMax' in fields.fieldsByTypeName.Instrument.themes.args)) { relations.push('themes'); }
    return getRepository(Instrument).find({
      where: { id: In(Array.from(instIdsRaw.map((elem) => String(elem.inst_id)))) },
      relations,
    });
  }
}
