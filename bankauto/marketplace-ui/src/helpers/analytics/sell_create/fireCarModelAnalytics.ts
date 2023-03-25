import { fireGenericSellCreateEvent } from './fireGenericSellCreateEvent';
import { EventLabel } from './constants';

export const fireCarModelAnalytics = () => {
  fireGenericSellCreateEvent({
    step: 2,
    eventLabel: EventLabel.CAR_MODEL,
  });
};
