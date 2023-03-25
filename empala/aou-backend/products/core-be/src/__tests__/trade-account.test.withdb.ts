import { getManager } from 'typeorm';
import { ApolloError } from 'apollo-server';
import connection from '../test-utils/connection';
import { launchpadUserMetadata } from '../test-utils/common';
import { EAccountType } from '../enums/onboarding/account-type';
import { TradeAccountResolver } from '../resolvers/trade-account';
import { createTradingAccount } from '../test-utils/trading-account';

describe('Onboarding resolver getTradeAccountId', () => {
  const userId = launchpadUserMetadata.user.id;
  beforeAll(async () => {
    process.env.NODE_ENV='development';
    await connection.create();
  }, connection.creationTimeoutMs);
  afterAll(async () => {
    await connection.close();
    process.env.NODE_ENV='test';
  });
  beforeEach(() => jest.clearAllMocks());


  it('should return tradeAccountId and create row in user_trade_account table', async () => {
    const tradeAccountId = 'test';
    await createTradingAccount(userId, tradeAccountId);
    const expectedTradeAccountId = await TradeAccountResolver.getTradeAccountId(userId);
    expect(tradeAccountId).toBeTruthy();
    expect(expectedTradeAccountId).toEqual(tradeAccountId);
  });

  it('should return same tradeAccountId when called twice', async () => {
    const firstTradeAccountId = await TradeAccountResolver.getTradeAccountId(userId);
    const secondTradeAccountId = await TradeAccountResolver.getTradeAccountId(userId);
    expect(firstTradeAccountId).toEqual(secondTradeAccountId);
  });

  it('should return error if there is no application for user', async () => {
    await getManager().query('DELETE FROM launchpad_ae_onboarding.application');
    try {
      await TradeAccountResolver.getTradeAccountId(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(ApolloError);
    }
  });
});
