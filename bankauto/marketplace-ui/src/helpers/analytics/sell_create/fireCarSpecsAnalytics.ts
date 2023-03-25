import { fireGenericSellCreateEvent } from './fireGenericSellCreateEvent';
import { EventLabel } from './constants';

export const fireCarSpecsAnalytics = () => {
  fireGenericSellCreateEvent({
    step: 3,
    eventLabel: EventLabel.CAR_SPECIFICATIONS,
  });
};
