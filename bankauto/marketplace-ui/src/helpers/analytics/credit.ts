import { AnalyticsEvent, pushAnalyticsEvent } from './pushAnalyticsEvent';

export const fireCreditSentAnalytics = (userId: string, applicationId?: string) => {
  pushAnalyticsEvent({
    event: 'emersionEvent_credit',
    user_id: userId,
    userAuth: 1,
    eventCategory: 'Заявка на кредит',
    eventAction: 'Подтверждение',
    eventLabel: applicationId,
  });
};

export const fireCreditBDAAnalytics = (category: string, step: number, userUuid?: string) => {
  const data: AnalyticsEvent = {
    userAuth: 0,
    user_id: null,
    event: 'GAcredit',
    eventCategory: category,
    eventAction: `step${step}success`,
  };

  if (userUuid) {
    data.userAuth = 1;
    data.user_id = userUuid;
  }

  pushAnalyticsEvent(data);
};
