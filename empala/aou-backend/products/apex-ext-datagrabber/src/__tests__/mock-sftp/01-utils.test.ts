import '../../init';
import { DateTime, Settings } from 'luxon';
import MockDate from 'mockdate';
import * as utils from '../../lib/utils';

const TIME_ZONE_CHICAGO = 'America/Chicago';
Settings.defaultZone = TIME_ZONE_CHICAGO;

const expectedNodeEnv = 'test-mock-sftp';
describe('Check environment variables', () => {
  test(`NODE_ENV should be "${expectedNodeEnv}"`, () => {
    expect(process.env.NODE_ENV).toEqual(expectedNodeEnv);
  });
});

describe('Testing of util methods', () => {
  test('Test conversion from yyyy-MM-dd to yyyyMMdd format', () => {
    expect(utils.ISO2YMD('2021-08-30')).toBe('20210830');
    expect(() => utils.ISO2YMD('021-08-30')).toThrow();
  });

  test('Test conversion from yyyy-MM-dd to MM/dd/yyyy format', () => {
    expect(utils.ISO2MDY('2021-08-30')).toBe('08/30/2021');
    expect(() => utils.ISO2MDY('021-08-30')).toThrow();
  });

  test('Test conversion from MM/dd/yyyy to yyyyMMdd format', () => {
    expect(utils.MDY2YMD('08/30/2021')).toBe('20210830');
    expect(() => utils.MDY2YMD('08/30/202')).toThrow();
  });

  test('subtractDays() should work properly', () => {
    const result = utils.subtractDays('2021-08-03', 4);
    expect(result).toBe('2021-07-30');
  });

  test('Test subtractBusinessDays() for 1 day before working Wednesday', () => {
    const result = utils.subtractBusinessDays('2021-08-26', 1);
    expect(result).toBe('2021-08-25');
  });

  test('Test subtractBusinessDays() for 2 days before Labor day', () => {
    // Labor day is September 6th
    const result = utils.subtractBusinessDays('2021-09-07', 2);
    expect(result).toBe('2021-09-02');
  });

  test('getBusinessDaysInRange() should returns correct values from Monday to Friday', () => {
    const result = utils.getBusinessDaysInRange('2021-10-23', '2021-10-31');
    const expectedBusinessDates = ['2021-10-25', '2021-10-26', '2021-10-27', '2021-10-28', '2021-10-29'];
    expect(result).toEqual(expectedBusinessDates);
  });

  test('getBusinessDaysInRange() should returns correct values, without holidays', () => {
    const result = utils.getBusinessDaysInRange('2021-08-30', '2021-09-08');
    // Excluded September 6th:
    const expectedBusinessDates = ['2021-08-30', '2021-08-31', '2021-09-01', '2021-09-02', '2021-09-03', '2021-09-07', '2021-09-08'];
    expect(result).toEqual(expectedBusinessDates);
  });

  test('getReportDates() should returns correct values with correct order', () => {
    const businessDays: ISODateString[] = ['2021-10-25', '2021-10-26'];
    const existingPriceDates: ISODateString[] = [];
    const result = utils.getReportDates(existingPriceDates, businessDays);
    expect(result).toEqual(['2021-10-26', '2021-10-25']);
  });

  test('getReportDates() should returns empty array if all dates are saved in DB', () => {
    const businessDays: ISODateString[] = ['2021-10-25', '2021-10-26'];
    const existingPriceDates: ISODateString[] = [...businessDays];
    const result = utils.getReportDates(existingPriceDates, businessDays);
    expect(result).toEqual([]);
  });

  [
    ['2021-11-19T03:00:00.000-06:00', '2021-11-17'],
    ['2021-11-19T13:00:00.000-06:00', '2021-11-18'],

    ['2021-11-20T03:00:00.000-06:00', '2021-11-18'],
    ['2021-11-20T13:00:00.000-06:00', '2021-11-19'],

    ['2021-11-21T03:00:00.000-06:00', '2021-11-19'],
    ['2021-11-21T13:00:00.000-06:00', '2021-11-19'],

    ['2021-11-22T03:00:00.000-06:00', '2021-11-19'],
    ['2021-11-22T13:00:00.000-06:00', '2021-11-19'],

    ['2021-11-23T03:00:00.000-06:00', '2021-11-19'],
    ['2021-11-23T13:00:00.000-06:00', '2021-11-22'],
  ].map(([refTimeISO, expected]) => {
    test(`getExpectedReportDate() for ${refTimeISO} should return ${expected}`, () => {
      MockDate.set(DateTime.fromISO(refTimeISO).toJSDate());
      const result = utils.getExpectedReportDate();
      MockDate.reset();
      expect(result).toEqual(expected);
    });
  });
});

