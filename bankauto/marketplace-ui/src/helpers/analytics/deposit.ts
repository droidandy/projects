import { AnalyticsEvent, pushAnalyticsEvent } from './pushAnalyticsEvent';

export const fireDepositFormSentAnalytics = (userUuid?: string) => {
  const data: AnalyticsEvent = {
    user_id: null,
    event: 'Deposit_FormSent',
    userAuth: 0,
  };
  if (userUuid) {
    data.userAuth = 1;
    data.user_id = userUuid;
  }

  pushAnalyticsEvent(data);
};
