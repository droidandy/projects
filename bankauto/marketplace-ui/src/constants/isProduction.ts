import { CURRENT_ENV, ENVS } from 'env-config';

export const isProduction = [ENVS.PRODUCTION, ENVS.STAGING].includes(CURRENT_ENV);
