import { pushAnalyticsEvent } from '../pushAnalyticsEvent';
import { NectarinEventsMap, pushNectarinAnalytics } from '../nectarin';

export const analyticsAuthFormRegistrationComplete = (userId = '') => {
  if (userId) {
    pushAnalyticsEvent({
      event: 'emersionEvent_reg',
      userAuth: 1,
      user_id: userId,
      eventCategory: 'Регистрация',
      eventAction: 'Подтверждение',
      eventLabel: userId,
    });
  }

  pushNectarinAnalytics(NectarinEventsMap.bankauto_media_2_2);
};
