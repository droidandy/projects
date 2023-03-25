import { pushAnalyticsEvent } from './pushAnalyticsEvent';

export const fireInstallmentSentAnalytics = (userId: string) => {
  pushAnalyticsEvent({
    event: 'installment_request',
    user_id: userId,
    userAuth: 1,
    eventCategory: 'Заявка',
    eventAction: 'Рассрочка',
    eventLabel: userId,
  });
};
