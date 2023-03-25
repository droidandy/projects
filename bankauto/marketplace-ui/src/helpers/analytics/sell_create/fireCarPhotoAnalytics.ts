import { fireGenericSellCreateEvent } from './fireGenericSellCreateEvent';
import { EventLabel } from './constants';

export const fireCarPhotoAnalytics = () => {
  fireGenericSellCreateEvent({
    step: 6,
    eventLabel: EventLabel.CAR_PHOTO,
  });
};
