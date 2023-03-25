import { fireGenericSellCreateEvent } from './fireGenericSellCreateEvent';
import { EventLabel } from './constants';

export const fireCarPriceAnalytics = () => {
  fireGenericSellCreateEvent({
    step: 5,
    eventLabel: EventLabel.CAR_PRICE,
  });
};
