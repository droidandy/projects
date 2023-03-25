import 'dotenv/config';
import { generate } from '@graphql-codegen/cli';
import { getCoreAccessToken } from '../lib/token';

const endpoint = process.env.APOLLO_SERVER_HOST_URI || 'http://localhost:3000';

(async () => {
  const token = await getCoreAccessToken();
  await generate(
    {
      schema: `${endpoint}/graphql`,
      config: {
        headers: {
          authorization: `Bearer ${token}`,
        },
        namingConvention: {
          enumValues: 'keep',
        },
        disableDescriptions: true,
        onlyOperationTypes: true,
      },
      generates: {
        [`${process.cwd()}/src/types/gql-types.ts`]: {
          plugins: ['typescript'],
        },
      },
    },
    true,
  );
})();
