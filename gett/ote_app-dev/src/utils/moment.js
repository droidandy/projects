import moment from 'moment-timezone';
import DeviceInfo from 'react-native-device-info';

export const is24HourFormat = DeviceInfo.is24Hour;

export const momentDate = date => moment(date);

export const jsDate = momentDate => momentDate.toDate();

export const calendarDate = date => momentDate(date).format('YYYY-MM-DD');

export const setDefaultTimezone = timezone => moment.tz.setDefault(timezone);

export const convertToZone = (date, timezone) => moment(date).tz(timezone);

export const minutesForward = minutes => moment().add(minutes, 'minutes');

export const timeFormat = () => (is24HourFormat() ? 'HH:mm' : 'h:mm a');

export const getSeparatedDate = (scheduledDate) => {
  const date = scheduledDate ? moment(scheduledDate) : moment();

  const year = date.format('YYYY');
  const month = date.format('M');
  const day = date.format('DD');

  return { year, month, day };
};
