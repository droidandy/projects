import jwksClient from 'jwks-rsa-promisified';
import { JWT, JWK } from 'jose';

/* istanbul ignore if */
if (!process.env.AWS_COGNITO_JWKS_CLIENT || !process.env.AWS_COGNITO_AUDIENCE_CLAIM || !process.env.AWS_COGNITO_ISSUER_CLAIM) {
  throw new Error('Access to Cognito should be configured: '
    + 'environment variables AWS_COGNITO_JWKS_CLIENT, AWS_COGNITO_AUDIENCE_CLAIM and AWS_COGNITO_ISSUER_CLAIM should be properly defined');
}

const client = jwksClient({ jwksUri: process.env.AWS_COGNITO_JWKS_CLIENT });

export const retrieveSigningKey = async (token: string) => {
  const { header } = JWT.decode(token, { complete: true });
  const { kid } = Object(header);
  return client.getSigningKeyAsync(kid);
};

export const verifyJwtToken = (token: string, key: any) => {
  const res = JWT.verify(token, JWK.asKey(key.rsaPublicKey), {
    audience: process.env.AWS_COGNITO_AUDIENCE_CLAIM,
    issuer: process.env.AWS_COGNITO_ISSUER_CLAIM,
    complete: true,
  });
  return res;
};
