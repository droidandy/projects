import { gql, GraphQLClient } from 'graphql-request';
import { logger } from './lib/logger';
import { getCoreAccessToken } from './lib/token';

let coreClient: GraphQLClient;
export const queryCore = async (query: string, values: any = null): Promise<any> => {
  if (!coreClient) {
    const endpoint = process.env.APOLLO_SERVER_HOST_URI;
    coreClient = new GraphQLClient(endpoint);
  }
  const token = await getCoreAccessToken();
  coreClient.setHeader('authorization', `Bearer ${token}`);
  return values ? coreClient.request(query, values) : coreClient.request(query);
};

export const getInstrumentListFromDb = async (): Promise<InstrumentToProcess[]> => {
  const feed = 'APEX';
  const query = gql`query mq($feed: EFeed) {
      inst: instrumentsInfo(feed: $feed) {
        ... on Instruments {
          instruments {
            id
            symbol
          }
        }
      }
    }`;
  const { inst: { instruments } } = await queryCore(query, { feed });

  return instruments as [];
};

export const saveLogos = async (logos: InstrumentLogosResponse, instId: BigInt): Promise<number> => {
  const startTime = Date.now();
  const query = `
  mutation createInstrumentLogos($input: CreateInstrumentLogosInput!) {
    createInstrumentLogos(input: $input) {
      ... on CreateInstrumentLogosSuccess {
        logos {
          id
        }
      }
      ... on CreateInvalidInputError {
        message
      }
    }
  }`;

  const input = {
    instId,
    logo: logos.logo,
    logoNormal: logos.logo_normal,
    logoOriginal: logos.logo_original,
    logoSquare: logos.logo_square,
    logoSquareStrict: logos.logo_square_strict,
    logoThumbnail: logos.logo_thumbnail,
  };

  const result = await queryCore(query, { input });
  if (result.createInstrumentLogos) {
    logger.info(`Successfully saved logos of "${logos.symbol}" [time: ${Date.now() - startTime} ms]`);
    return 1;
  }
  logger.info(`Error saving logos of "${logos.symbol}" ${result.message} [time: ${Date.now() - startTime} ms]`);
  return 0;
};
