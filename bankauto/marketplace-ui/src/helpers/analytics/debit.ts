import { DebitCardName } from '../../store/types';
import { AnalyticsEvent, pushAnalyticsEvent } from './pushAnalyticsEvent';

export const fireDebitFormSentAnalytics = (userUuid?: string, debitCardName?: DebitCardName) => {
  const data: AnalyticsEvent = {
    event: 'debitCard_FormSent',
    user_id: null,
    userAuth: 0,
    eventCategory: `${debitCardName || 'debit-card-not-selected'}_FormSent`,
  };
  if (userUuid) {
    data.userAuth = 1;
    data.user_id = userUuid;
  }

  pushAnalyticsEvent(data);
};
