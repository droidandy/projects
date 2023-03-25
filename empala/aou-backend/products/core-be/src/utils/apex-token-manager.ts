import jws from 'jws';
import { v4 as uuid } from 'uuid';
import axios, { AxiosResponse, Method } from 'axios';
import { ApolloError } from 'apollo-server-errors';
import { logger } from '../../../utils/src/logger';
import { sendAxiosRequest } from './axios-adapter';

export class ApexTokenManager {
  private static readonly TOKEN_TTL_MS = 45 * 60 * 1000; // 45 mins

  private static readonly HASHING_ALGO = 'HS512';

  private static readonly JWT_PAYLOAD_ISS = 'AOU';

  private static readonly JWT_PAYLOAD_EXPIRATION_IN_SEC = 59; // Has to be less than one minute per Apex

  private static readonly GRAPHQL_ERROR_MESSAGE = 'Error communicating with execution server';

  private static tradeToken: string;

  private static tradeTokenExpiresAt: number;

  private static accountManagementInitiatorId: string;

  private static accountManagementToken: string;

  private static accountManagementTokenExpiresAt: number;

  public static clearToken(): void {
    this.tradeToken = undefined;
    this.tradeTokenExpiresAt = 0;
  }

  public static async getTradeToken(): Promise<string> {
    if (this.tradeToken && new Date().valueOf() < this.tradeTokenExpiresAt) { return this.tradeToken; }

    logger.info('Generating a new Apex Extend Trade action token');

    const iat = Math.floor((new Date()).valueOf() / 1000); // unix time
    const jwsSigned = jws.sign({
      header: {
        alg: this.HASHING_ALGO,
      },
      secret: process.env.APEX_EXTEND_TRADE_API_KEY,
      payload: {
        entity: process.env.APEX_EXTEND_TRADE_API_ENTITY,
        group: process.env.APEX_EXTEND_TRADE_API_GROUP,
        iss: this.JWT_PAYLOAD_ISS,
        jti: uuid(),
        iat,
        exp: iat + this.JWT_PAYLOAD_EXPIRATION_IN_SEC,
      },
    });

    const response = await sendAxiosRequest(
      'get',
      `${process.env.APEX_EXTEND_TRADE_API_URL}/c2c/jws.action?jws=${jwsSigned}`,
      this.GRAPHQL_ERROR_MESSAGE,
    );
    if (response.data.success !== true) {
      // Handle errors returned by Apex about invalid request, these don't throw an exception
      logger.error(`Apex rejected token generation with response: ${JSON.stringify(response.data)}`);
      throw new ApolloError(this.GRAPHQL_ERROR_MESSAGE);
    }
    this.tradeToken = Buffer.from(response.data.token).toString('base64');
    this.tradeTokenExpiresAt = new Date().valueOf() + this.TOKEN_TTL_MS;
    return this.tradeToken;
  }

  public static async sendTradeApiAxiosRequest(method: Method, url: string, data?: any): Promise<AxiosResponse> {
    const headers = {
      'Cache-Control': 'no-cache',
      Accept: '*/*',
      'Content-Type': 'application/json',
      Authorization: `C2C ${await this.getTradeToken()}`,
    };
    return sendAxiosRequest(method, process.env.APEX_EXTEND_TRADE_API_URL + url, this.GRAPHQL_ERROR_MESSAGE, data, { headers });
  }

  public static async sendAccountApiAxiosRequest(method: Method, url: string, data?: any): Promise<AxiosResponse> {
    const headers = {
      Authorization: `Bearer ${(await this.getAccountManagementToken()).token}`,
      'Content-Type': 'application/json',
    };
    return sendAxiosRequest(method, process.env.APEX_EXTEND_APPLICATIONS_URL + url, 'Error sending application request', data, { headers });
  }

  public static async getAccountManagementToken(): Promise<{ initiatorId: string; token: string }> {
    if (this.accountManagementToken && new Date().valueOf() < this.accountManagementTokenExpiresAt) {
      return { token: this.accountManagementToken, initiatorId: this.accountManagementInitiatorId };
    }
    const response = await axios.post(
      `${process.env.APEX_EXTEND_APPLICATIONS_URL}/api/auth/login`,
      {
        with: ['user'],
        // eslint-disable-next-line camelcase
        api_key: process.env.APEX_EXTEND_APPLICATIONS_ADMIN_API_KEY,
        // eslint-disable-next-line camelcase
        api_secret: process.env.APEX_EXTEND_APPLICATIONS_ADMIN_API_SECRET,
      },
    );
    this.accountManagementToken = response.data.login.token.access_token;
    this.accountManagementInitiatorId = response.data.login.user.id;
    this.accountManagementTokenExpiresAt = new Date().valueOf() + this.TOKEN_TTL_MS;
    return {
      token: this.accountManagementToken,
      initiatorId: this.accountManagementInitiatorId,
    };
  }
}
