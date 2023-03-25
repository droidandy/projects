import { fireGenericSellCreateEvent } from './fireGenericSellCreateEvent';
import { EventLabel } from './constants';

export const fireCarConditionAnalytics = () => {
  fireGenericSellCreateEvent({
    step: 4,
    eventLabel: EventLabel.CAR_CONDITION,
  });
};
