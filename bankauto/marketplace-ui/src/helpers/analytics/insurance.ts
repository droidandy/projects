import { APPLICATION_INSURANCE_TYPE } from '@marketplace/ui-kit/types';
import { pushAnalyticsEvent } from './pushAnalyticsEvent';

export const fireInsuranceSentAnalytics = (
  userId: string,
  type: APPLICATION_INSURANCE_TYPE,
  applicationId?: number,
) => {
  pushAnalyticsEvent({
    event: 'emersionEvent_insur',
    user_id: userId,
    userAuth: 1,
    eventCategory: `Покупка страховки ${type === 'kasko' ? 'КАСКО' : 'ОСАГО'}`,
    eventAction: 'Подтверждение',
    eventLabel: `${applicationId}`,
  });
};
