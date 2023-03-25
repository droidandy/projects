import { getRepository } from 'typeorm';
import { ApolloError } from 'apollo-server';
import { Application } from '../models/application';
import { EApplicationStatus } from '../enums/onboarding/application-status';
import { EAccountType } from '../enums/onboarding/account-type';

export class TradeAccountResolver {
  public static async getTradeAccountId(userId: number | string): Promise<string> {
    const userApplication = await getRepository(Application).findOne({
      userId,
      status: EApplicationStatus.COMPLETED,
      accountType: EAccountType.CASH,
    });
    if (userApplication && userApplication.tradeAccountId) {
      return userApplication.tradeAccountId;
    }
    throw new ApolloError('Please pass onboarding before starting trading');
  }
}
