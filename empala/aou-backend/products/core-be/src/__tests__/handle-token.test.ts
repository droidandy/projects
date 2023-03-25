import { JWT } from 'jose';

process.env.AWS_COGNITO_AUDIENCE_CLAIM = 'AWS_COGNITO_AUDIENCE_CLAIM';
process.env.AWS_COGNITO_ISSUER_CLAIM = 'AWS_COGNITO_ISSUER_CLAIM';
process.env.AWS_COGNITO_JWKS_CLIENT = 'AWS_COGNITO_JWKS_CLIENT';

import { retrieveSigningKey, verifyJwtToken } from '../security/handle-token';

jest.mock('jose', () => (
  {
    JWT: {
      decode: jest.fn().mockImplementation(() => ({
        header: {
          kid: '5678example='
        }
      })),
      verify: jest.fn().mockImplementation(() => ({
        sub: 'userid',
        name: 'User Name',
        // eslint-disable-next-line camelcase
        token_use: 'id'
      }))
    },
    JWK: {
      asKey: jest.fn().mockImplementation(() => ({
        alg: 'RS256',
        e: 'AQAB'
      }))
    }
  })
);

jest.mock('jwks-rsa-promisified', () =>
  jest.fn().mockImplementation(() => ({
    getSigningKeyAsync: jest.fn().mockImplementation(() => Promise.resolve('signing-key'))
  }))
);

describe('The token authentication service', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should retrieve signing key given a token', async () => {
    const signingKey = await retrieveSigningKey('jwt-token');

    expect(signingKey).toEqual('signing-key');
    expect(JWT.decode).toHaveBeenCalledWith('jwt-token', { complete: true });
  });

  it('should verify jwt token', () => {
    const decodedKey = verifyJwtToken('jwt-token', 'public-key');

    expect(decodedKey).toEqual({
      sub: 'userid',
      name: 'User Name',
      // eslint-disable-next-line camelcase
      token_use: 'id'
    });
    expect(JWT.verify).toHaveBeenCalledWith(
      'jwt-token',
      {
        alg: 'RS256',
        e: 'AQAB'
      },
      { audience: process.env.AWS_COGNITO_AUDIENCE_CLAIM, issuer: process.env.AWS_COGNITO_ISSUER_CLAIM, complete: true }
    );
  });
});
