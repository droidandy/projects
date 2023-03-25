import connection from '../test-utils/connection';
import { gCall } from '../test-utils/gcall';
import { checkForbiddenError, launchpadUserMetadata } from '../test-utils/common';
import { Theme } from '../models/theme';

describe('The GraphQL themes queries', () => {
  beforeAll(async () => {
    await connection.create();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
  });
  beforeEach(() => jest.clearAllMocks());

  const createThemesQuery = (themeFields: string, nMax?: number) =>
    `query Query {
        themes ${nMax ? '(nMax: ' + nMax + ')' : '' } {
          ... on Themes {
            themes {
              ${themeFields}
            }
          }
        }
      }`;

  it('can return themes and their members', async () => {

    let result = await gCall({ source: createThemesQuery('id name') });
    expect(result.data.themes.themes.length).toEqual(38);
    expect(result.data.themes.themes[0].name).toEqual('Agriculture');
    expect(result.data.themes.themes[0].instruments).toBeUndefined();

    // pass both nMax and get instruments
    result = await gCall({ source: createThemesQuery('id name instruments { symbol feeds exchange { name } }', 5) });
    const agricultureIndex = result.data.themes.themes.findIndex((theme: Theme) => theme.name === 'Agriculture');
    expect(result.data.themes.themes.length).toEqual(5);
    expect(result.data.themes.themes[agricultureIndex].name).toEqual('Agriculture');
    expect(result.data.themes.themes[agricultureIndex].instruments.length).toEqual(8);
    expect(result.data.themes.themes[agricultureIndex].instruments.some((i: any) => i.symbol === 'MOS')).toEqual(true);

    // passing nMax for themes and their instruments also.  Passing nMax for instruments runs a different code path
    result = await gCall({ source: createThemesQuery('id name instruments(nMax: 8) { symbol feeds exchange { name } }', 5) });
    expect(result.data.themes.themes.length).toEqual(5);
    expect(result.data.themes.themes[agricultureIndex].instruments.length).toEqual(8);
  });

  it('cannot return stacks and hunches as nested members for themes being unauthorized', async () => {

    // go 3 levels deep
    // TODO: missing hunches and stacks, try adding dummy data
    const result = await gCall({
      source: createThemesQuery(`id name instruments(nMax: 5) {
      symbol
      themes { id }
      hunches { id }
      stacks { id }
    }`, 5), graphQLErrorExpected: true
    });
    checkForbiddenError(result);
  });

  it('can return stacks and hunches as nested members for themes being authorized', async () => {

    // go 3 levels deep
    // TODO: missing hunches and stacks, try adding dummy data
    const result = await gCall({
      source: createThemesQuery(`id name instruments(nMax: 5) {
        symbol
        feeds
        exchange { name }
        themes { id }
        hunches { id }
        stacks { id }
      }`, 5),
      variableValues: {},
      contextValue: {
        metadata: launchpadUserMetadata
      }
    });

    // console.log(result.data.themes.themes[0].instruments.forEach((i: any) => console.log(i.hunches)));
    // expect(result.data.themes.themes[0].instruments.length).toEqual(8);
  });
});
