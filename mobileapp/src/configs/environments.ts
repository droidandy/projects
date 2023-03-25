const API_URL = 'https://aptstore.ru/mobile/graphql';
const BASE_URL = 'https://aptstore.ru';
const NO_IMAGE_PATH = '/local/templates/.default/img/no-photo.jpg';

export type EnvUrl = {
  graphqlUrl: string;
  imageBaseUrl: string;
  baseUrl: string;
};

export interface Environments {
  [key: string]: EnvUrl;
}

const ENV: Environments = {
  dev: {
    graphqlUrl: 'http://192.168.88.40:4444/mobile/graphql',
    imageBaseUrl: BASE_URL,
    baseUrl: BASE_URL,
  },
  staging: {
    graphqlUrl: API_URL,
    imageBaseUrl: BASE_URL,
    baseUrl: BASE_URL,
  },
  prod: {
    graphqlUrl: API_URL,
    imageBaseUrl: BASE_URL,
    baseUrl: BASE_URL,
  },
};

export const getEnvVars = (): EnvUrl => {
  return __DEV__ ? ENV.dev : ENV.prod;
};
export const getImageUrl = (path?: string | null): string => {
  const rel = path || NO_IMAGE_PATH;
  return `${getEnvVars().imageBaseUrl}${rel}`;
};

export const getFullUrl = (relPath: string): string => {
  return `${getEnvVars().baseUrl}${relPath}`;
};

export const DEV_LOGIN = __DEV__ ? 'jonny-the-test@gmail.com' : '';
export const DEV_PASS = __DEV__ ? '123456' : '';
