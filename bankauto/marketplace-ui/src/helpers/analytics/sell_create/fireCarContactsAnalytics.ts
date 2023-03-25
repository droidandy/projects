import { fireGenericSellCreateEvent } from './fireGenericSellCreateEvent';
import { EventLabel } from './constants';

export const fireCarContactsAnalytics = () => {
  fireGenericSellCreateEvent({
    step: 1,
    eventLabel: EventLabel.CAR_CONTACTS,
  });
};
