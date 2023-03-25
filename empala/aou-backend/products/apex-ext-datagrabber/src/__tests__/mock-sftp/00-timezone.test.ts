import '../../init';
import { DateTime, Settings } from 'luxon';

const TIME_ZONE_CHICAGO = 'America/Chicago';

describe('Test TimeZone methods', () => {
  const format = 'yyyy-LL-dd HH:mm ZZ';

  test(`Setting the date-time in the ${TIME_ZONE_CHICAGO} time zone should work properly`, () => {
    const dtString = '2021-11-26T12:22:10';

    let dt = DateTime.fromISO(dtString, { zone: 'UTC' });
    expect(dt.toFormat(format)).toEqual('2021-11-26 12:22 +00:00');

    dt = DateTime.fromISO(dtString, { zone: TIME_ZONE_CHICAGO });
    expect(dt.toFormat(format)).toEqual('2021-11-26 12:22 -06:00');
    expect(dt.isInDST).toEqual(false);
  });

  test(`Setting the date-time in the ${TIME_ZONE_CHICAGO} time zone should work properly when date in DST`, () => {
    const dtString = '2021-08-26T12:22:10';

    let dt = DateTime.fromISO(dtString, { zone: 'UTC' });
    expect(dt.toFormat(format)).toEqual('2021-08-26 12:22 +00:00');

    dt = DateTime.fromISO(dtString, { zone: TIME_ZONE_CHICAGO });
    expect(dt.toFormat(format)).toEqual('2021-08-26 12:22 -05:00');
    expect(dt.isInDST).toEqual(true);
  });

  test('Setting the date-time with specified timezone offset should work properly', () => {
    const dt = DateTime.fromISO('2021-11-26T12:22:10', { zone: 'UTC-6' });
    expect(dt.toFormat(format)).toEqual('2021-11-26 12:22 -06:00');
    expect(dt.isInDST).toEqual(false);
  });

  test('Setting date and time with specified timezone offset does not have to respect DST', () => {
    const dt = DateTime.fromISO('2021-08-26T12:22:10', { zone: 'UTC-6' });
    expect(dt.toFormat(format)).toEqual('2021-08-26 12:22 -06:00');
    expect(dt.isInDST).toEqual(false);
  });

  test('After setting the default timezone, the date should be automatically set to that timezone', () => {
    Settings.defaultZone = TIME_ZONE_CHICAGO;
    const dt = DateTime.fromISO('2021-08-26T12:22:10');
    expect(dt.toFormat(format)).toEqual('2021-08-26 12:22 -05:00');
  });

  test('After setting the default timezone, the current date should be automatically set to that timezone', () => {
    Settings.defaultZone = 'EST';
    const dt = DateTime.now();
    expect(dt.zoneName).toEqual('EST');
    expect(dt.offset).toEqual(-300);
  });

  test('Changing the timezone should work properly: count of milliseconds should remain unchanged', () => {
    const dt = DateTime.fromISO('2021-08-26T12:22:10', { zone: 'UTC-6' });
    expect(dt.toFormat(format)).toEqual('2021-08-26 12:22 -06:00');
    const rezoned = dt.setZone('UTC-5');
    expect(rezoned.toFormat(format)).toEqual('2021-08-26 13:22 -05:00');
    expect(dt.toMillis()).toEqual(rezoned.toMillis());
  });

  test('Changing the timezone with  keep local time should work properly: the time value must remain unchanged', () => {
    const dt = DateTime.fromISO('2021-08-26T12:22:10', { zone: 'UTC-6' });
    expect(dt.toFormat(format)).toEqual('2021-08-26 12:22 -06:00');

    const dtMoscow = dt.setZone('UTC+3', { keepLocalTime: true });
    expect(dtMoscow.toFormat(format)).toEqual('2021-08-26 12:22 +03:00');
    expect(dt.toMillis() - 9 * 3600_000).toEqual(dtMoscow.toMillis());
    // Chicago 12:22 PM 9 hours after 12:22 PM Moscow
    // Therefore, if at the moment when in Chicago 12:22 we subtract 9 3600_000 ms,
    // we will return to the past by 9 hours, when in Moscow it was 12:22
  });

  test('An example of converting the time received from the database (in UTC) to the corresponding time in another timezone', () => {
    let dtUTC = DateTime.utc(2021, 8, 26, 22, 0, 0);
    expect(dtUTC.toFormat(format)).toEqual('2021-08-26 22:00 +00:00');

    let dtMoscow = dtUTC.setZone('UTC+3');
    expect(dtMoscow.toFormat(format)).toEqual('2021-08-27 01:00 +03:00');
    expect(dtUTC.toMillis()).toEqual(dtMoscow.toMillis());

    Settings.defaultZone = TIME_ZONE_CHICAGO;
    // When specify an offset as part of the string itself, Luxon interprets the time as being specified with
    // that offset, but converts the resulting DateTime into the system's local zone (just set as TIME_ZONE_CHICAGO):
    const dtUTCasSystemTZ = DateTime.fromISO('2021-08-26T22:00:00.123+00:00');
    expect(dtUTCasSystemTZ.toFormat(format)).toEqual('2021-08-26 17:00 -05:00');

    // If we want the object to be represented with UTC zone, we do this:
    dtUTC = DateTime.fromISO('2021-08-26T22:00:00.123+00:00', { zone: 'UTC' });
    expect(dtUTC.toFormat(format)).toEqual('2021-08-26 22:00 +00:00');
    // But the absolute value of time is the same in both cases:
    expect(dtUTCasSystemTZ.toMillis()).toEqual(dtUTC.toMillis());

    // And even if we shift the timezone again, the absolute value of time will remain the same:
    dtMoscow = dtUTC.setZone('UTC+3');
    expect(dtMoscow.toFormat(format)).toEqual('2021-08-27 01:00 +03:00');
    expect(dtUTC.toMillis()).toEqual(dtMoscow.toMillis());
  });

  test('An example of converting the time in Chicago timezone to the database time (in UTC)', () => {
    const dtChicago = DateTime.fromISO('2021-11-26T12:00:00', { zone: TIME_ZONE_CHICAGO });
    expect(dtChicago.toFormat(format)).toEqual('2021-11-26 12:00 -06:00');

    const dtUTC = dtChicago.setZone('UTC');
    expect(dtUTC.toISO()).toEqual('2021-11-26T18:00:00.000Z');
    expect(dtUTC.toMillis()).toEqual(dtChicago.toMillis());
  });
});
