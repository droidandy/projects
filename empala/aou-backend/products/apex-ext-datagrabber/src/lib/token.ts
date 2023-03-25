/* istanbul ignore file */
import { getIdToken, GetIdTokenResponse, TokenInfo } from '../../../utils/src/get-idtoken';
import { exitOnError } from './logger';

let coreAccessTokenInfo: TokenInfo = null;

export const getCoreAccessToken = async (): Promise<string | undefined> => {
  if (coreAccessTokenInfo && (Number(coreAccessTokenInfo.exp) > (Date.now() / 1000) + 60)) {
    return coreAccessTokenInfo.token;
  }
  const user = process.env.AWS_COGNITO_MARKETDATA_UPDATER_USER_NAME;
  const tokenInfo: GetIdTokenResponse = await getIdToken(
    user,
    process.env.AWS_COGNITO_MARKETDATA_UPDATER_USER_PASSWORD,
  );
  if (tokenInfo.statusCode !== 200) {
    const err = new Error(`Failed to load token for MarketDataUpdated user "${user}": ${tokenInfo.response.toString()}`);
    exitOnError(err);
    return undefined;
  }
  coreAccessTokenInfo = tokenInfo.response as TokenInfo;
  return coreAccessTokenInfo.token;
};
