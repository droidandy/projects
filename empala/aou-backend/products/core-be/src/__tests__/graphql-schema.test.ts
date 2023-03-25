import { EOL } from 'os';
import * as fs from 'fs';
import { buildSchema } from 'type-graphql';
import { printSchema } from 'graphql';
import { authChecker } from '../security/auth-checker';

const currentSchemaFile = 'current-schema.graphql';

const normalize = (schema: string) => {
  return schema.split(EOL).map((v)=>{v.trim()}).join('\n');
}

describe('Validate GraphQL schema', () => {
  it('The current-schema file matches what is defined in code', async () => {
    const schema = await buildSchema({ resolvers: [__dirname + '/../resolvers/**/*.{ts,js}'], authChecker });
    const schemaInCode = normalize(printSchema(schema));
    const schemaInFile = normalize(fs.readFileSync(`${__dirname}/../../${currentSchemaFile}`).toString());
    expect(schemaInFile).toBe(schemaInCode);
  });
});
