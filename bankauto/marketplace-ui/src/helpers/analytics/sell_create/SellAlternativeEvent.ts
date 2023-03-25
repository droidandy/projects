import { pushAnalyticsEvent } from 'helpers/analytics/pushAnalyticsEvent';

export enum Events {
  POP_UP = 'popUp',
  SMS_SEND = 'smsSend',
}

export const SellAlternativeEvent = (event: Events) => {
  pushAnalyticsEvent({
    event,
    user_id: 'someUserId',
    userAuth: 1,
    eventAction: 'sendForm',
    eventCategory: 'spec',
  });
};
