// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const getUserPool = () => new CognitoUserPool({
  UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.AWS_COGNITO_CLIENT_ID,
});

const getCognitoUser = (nameOrEmail: string) => new CognitoUser({
  Username: nameOrEmail,
  Pool: getUserPool(),
});

const getAuthDetails = (nameOrEmail: string, password: string) => new AuthenticationDetails({
  Username: nameOrEmail,
  Password: password,
});

const decodeJWTToken = (token: string) => {
  const payload = Object(jwt_decode(token));
  // eslint-disable-next-line camelcase
  const {
    email, exp, auth_time: authTime, token_use: tokenUse, sub,
  } = payload;
  const username = payload['cognito:username'];
  // eslint-disable-next-line camelcase
  return {
    token, username, email, exp, uid: sub, auth_time: authTime, token_use: tokenUse,
  };
};

export interface TokenInfo {
  token: string;
  username: string;
  email: string;
  exp: string;
  uid: string;
  auth_time: string;
  token_use: string;
}

export interface GetIdTokenResponse {
  statusCode: number;
  response: string | TokenInfo;
}

export const getIdToken = (nameOrEmail: string, password: string): Promise<GetIdTokenResponse> => {
  const user = getCognitoUser(nameOrEmail);
  const authDetails = getAuthDetails(nameOrEmail, password);
  return new Promise((resolve) => {
    user.authenticateUser(authDetails, {
      onSuccess: (result) => resolve({ statusCode: 200, response: decodeJWTToken(result.getIdToken().getJwtToken()) }),

      onFailure: (err) => resolve({ statusCode: 400, response: err.message || JSON.stringify(err) }),
    });
  });
};

export const printIdTokenForReadonlyAdminUser = () => getIdToken(
  process.env.AWS_COGNITO_READONLY_ADMIN_USER_NAME,
  process.env.AWS_COGNITO_READONLY_ADMIN_USER_PASSWORD,
).then((response) => console.log(response));

export const printIdTokenForMarketdataUpdaterUser = () => getIdToken(
  process.env.AWS_COGNITO_MARKETDATA_UPDATER_USER_NAME,
  process.env.AWS_COGNITO_MARKETDATA_UPDATER_USER_PASSWORD,
).then((response) => console.log(response));

export const printIdTokenForTestUser = () => getIdToken(
  process.env.AWS_COGNITO_TEST_USER_EMAIL,
  process.env.AWS_COGNITO_TEST_USER_PASSWORD,
).then((response) => console.log(JSON.stringify(response)));
