import { createUnionType, Field, ObjectType } from 'type-graphql';
import { Theme } from '../models/theme';

@ObjectType()
export class Themes {
  @Field(() => [Theme])
  public themes: Theme[];
}

export const ThemesResult = createUnionType({
  name: 'ThemesResult',
  description: 'Used for themes query',
  types: () => [Themes],
});
