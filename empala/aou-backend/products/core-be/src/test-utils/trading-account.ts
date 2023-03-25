import { getManager } from 'typeorm';

export const createTradingAccount = async (userId: any, tradeAccountId: string) => {
  await getManager().query(`insert into launchpad_ae_onboarding.application
    (apex_application_id, status, user_id, trade_account_id)
     VALUES ('123', 'COMPLETED', ${userId}, '${tradeAccountId}');`);
};

export const deleteTradingAccounts = async () => {
  await getManager().query('delete from launchpad_ae_onboarding.application;');
};
