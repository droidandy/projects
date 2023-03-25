import { fireCarModelAnalytics } from './fireCarModelAnalytics';
import { fireCarSpecsAnalytics } from './fireCarSpecsAnalytics';
import { fireCarConditionAnalytics } from './fireCarConditionAnalytics';
import { fireCarPriceAnalytics } from './fireCarPriceAnalytics';
import { fireCarPhotoAnalytics } from './fireCarPhotoAnalytics';
import { fireCarContactsAnalytics } from './fireCarContactsAnalytics';
import { fireFormFinishAnalytics } from './fireFormFinishAnalytics';
import { EventLabel } from './constants';

const EVENTS = {
  [EventLabel.CAR_CONTACTS]: fireCarContactsAnalytics,
  [EventLabel.CAR_MODEL]: fireCarModelAnalytics,
  [EventLabel.CAR_SPECIFICATIONS]: fireCarSpecsAnalytics,
  [EventLabel.CAR_CONDITION]: fireCarConditionAnalytics,
  [EventLabel.CAR_PRICE]: fireCarPriceAnalytics,
  [EventLabel.CAR_PHOTO]: fireCarPhotoAnalytics,
  [EventLabel.FORM_COMPLETED]: fireFormFinishAnalytics,
} as { [key in EventLabel]: () => void };

export const fireSellCreateAnalytics = (label: EventLabel) => {
  EVENTS[label]();
};
