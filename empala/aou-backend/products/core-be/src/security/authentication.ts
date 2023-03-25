import { ApolloError } from 'apollo-server';
import { AuthenticationError } from 'apollo-server-errors';
import { getRepository } from 'typeorm';
import { User } from '../models/user';
import { EAccessRole } from './auth-checker';
import { retrieveSigningKey, verifyJwtToken } from './handle-token';

export const authenticate = async (token: string, isIntrospectionQuery: boolean) => {
  if (!token) {
    const error = new AuthenticationError('No authorization header is given');
    if (!error.extensions.exception) {
      error.extensions.exception = {};
    }
    error.extensions.exception.code = 'NO_AUTH_HEADER';
    error.extensions.isIntrospectionQuery = isIntrospectionQuery;
    throw error;
  }

  const {
    username, email, sessionId, authTime,
  } = await decodeHeader(token, isIntrospectionQuery);
  if (username === process.env.AWS_COGNITO_READONLY_ADMIN_USER_NAME) {
    return {
      role: EAccessRole.READONLY_ADMIN,
    };
  } if (username === process.env.AWS_COGNITO_MARKETDATA_UPDATER_USER_NAME) {
    return {
      role: EAccessRole.MARKETDATA_UPDATER,
    };
  }

  const user: User = await getRepository(User)
    .createQueryBuilder('user')
    .select(['user.id'])
    .where('user.userName = :username', { username })
    .getOne();

  const meta = {
    role: EAccessRole.LAUNCHPAD_USER,
    user,
    token: {
      username,
      email,
    },
    session: {
      id: sessionId,
      authTime,
    },
  };

  return meta;
};

const decodeHeader = async (authorizationHeader: string, isIntrospectionQuery: boolean) => {
  const jwtToken = await getJwtToken(authorizationHeader, isIntrospectionQuery);
  try {
    const signingKey = await retrieveSigningKey(jwtToken);
    const decodedToken = verifyJwtToken(jwtToken, signingKey);
    const payload = Object(decodedToken.payload);
    // eslint-disable-next-line camelcase
    const { email, event_id: eventId, auth_time: authTime } = payload;
    const username = payload['cognito:username'];

    // eslint-disable-next-line camelcase
    return {
      username, email, sessionId: eventId, authTime,
    };
  } catch (err) {
    if (err instanceof ApolloError) {
      err.extensions.isIntrospectionQuery = isIntrospectionQuery;
      throw err;
    } else {
      const error = new AuthenticationError((err as ApolloError).message, (err as ApolloError).extensions);
      error.extensions.isIntrospectionQuery = isIntrospectionQuery;
      error.originalError = err as ApolloError;
      throw error;
    }
  }
};

const getJwtToken = async (authorizationHeader: string, isIntrospectionQuery: boolean) => {
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    return authorizationHeader.slice(7);
  }
  const error = new AuthenticationError('authorization header is badly formed');
  if (!error.extensions.exception) {
    error.extensions.exception = {};
  }
  error.extensions.exception.code = 'AUTH_HEADER_BADLY_FORMED';
  error.extensions.isIntrospectionQuery = isIntrospectionQuery;
  throw error;
};
