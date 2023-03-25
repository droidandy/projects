import { fireGenericSellCreateEvent } from './fireGenericSellCreateEvent';
import { EventLabel } from './constants';

export const fireFormFinishAnalytics = () => {
  fireGenericSellCreateEvent({
    step: 7,
    eventLabel: EventLabel.FORM_COMPLETED,
  });
};
