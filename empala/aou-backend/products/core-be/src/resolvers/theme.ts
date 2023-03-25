import {
  Resolver, Query, FieldResolver, Root, Arg, Int,
} from 'type-graphql';
import { ResolveTree } from 'graphql-parse-resolve-info';
import { getManager, getRepository, In } from 'typeorm';
import { Theme } from '../models/theme';
import { Instrument } from '../models/instrument';
import { Fields } from '../utils/graphql/common';
import { Themes, ThemesResult } from '../results/theme';

@Resolver(() => Theme)
export class ThemeResolver {
  @Query(() => ThemesResult, { description: 'NO AUTH - AOU-359, AOU-517 -> AOU-73, AOU-82' })
  public async themes(
    @Fields() fields: ResolveTree,
      @Arg('nMax', () => Int, { nullable: true }) nMax?: number,
  ): Promise<typeof ThemesResult> {
    const result = new Themes();
    const themesFields = fields.fieldsByTypeName.Themes.themes.fieldsByTypeName.Theme;
    const relations = [];
    if ('instruments' in themesFields && !('nMax' in themesFields.instruments.args)) relations.push('instruments');
    result.themes = await getRepository(Theme).find({
      skip: 0,
      take: nMax,
      relations,
    });
    return result;
  }

  @FieldResolver()
  public async instruments(
    @Fields() fields: ResolveTree,
      @Root() theme: Theme,
      @Arg('nMax', () => Int, { nullable: true }) nMax: number,
  ): Promise<Instrument[]> {
    if (theme.instruments) {
      return theme.instruments;
    }
    const instIdsRaw = await getManager().createQueryBuilder()
      .select('inst_id')
      .from('theme_inst', 'theme_inst')
      .where('theme_inst.theme_id = :themeId', { themeId: theme.id })
      .skip(0)
      .limit(nMax)
      .getRawMany();
    const relations = [];
    if ('themes' in fields.fieldsByTypeName.Instrument
        && !('nMax' in fields.fieldsByTypeName.Instrument.themes.args)) relations.push('themes');
    if ('feeds' in fields.fieldsByTypeName.Instrument) { relations.push('instrumentFeeds'); }
    if ('exchange' in fields.fieldsByTypeName.Instrument) { relations.push('exchange'); }
    return getRepository(Instrument).find({
      where: { id: In(Array.from(instIdsRaw.map((elem) => String(elem.inst_id)))) },
      relations,
    });
  }
}
