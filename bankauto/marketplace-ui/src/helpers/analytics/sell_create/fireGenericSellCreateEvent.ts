import { pushAnalyticsEvent } from 'helpers/analytics/pushAnalyticsEvent';
import { EventLabel } from './constants';

interface EventRest {
  eventLabel: EventLabel;
  step: number;
}

export const fireGenericSellCreateEvent = ({ eventLabel, step }: EventRest) => {
  pushAnalyticsEvent({
    event: 'sellAuto_funnel',
    user_id: 'someUserId',
    userAuth: 1,
    eventCategory: 'sellAuto',
    eventAction: `step${step}_done`,
    eventLabel,
  });
};
