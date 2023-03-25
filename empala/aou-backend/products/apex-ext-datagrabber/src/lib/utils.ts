// @ts-ignore
import businessDays from 'business-days-js';
import { DateTime } from 'luxon';
import { ISO_DATE_FORMAT } from '../constants';
import config from './config';

export const timeTaken = (startTime: number): string => `[time: ${Date.now() - startTime} ms]`;

const reISO = /^(\d{4})-(\d\d)-(\d\d)$/;
const reMDY = /^(\d\d)\/(\d\d)\/(\d{4})$/;

export const ISO2YMD = (iso: ISODateString): YMDDateString => {
  if (!reISO.test(iso)) {
    throw new Error('Input date format does not match the pattern yyyy-MM-dd');
  }
  return iso.replace(/-/g, '');
};

export const ISO2MDY = (iso: ISODateString): MDYDateString => {
  if (!reISO.test(iso)) {
    throw new Error('Input date format does not match the pattern yyyy-MM-dd');
  }
  return iso.replace(reISO, '$2/$3/$1');
};

export const MDY2YMD = (mdy: MDYDateString): YMDDateString => {
  if (!reMDY.test(mdy)) {
    throw new Error('Input date format does not match the pattern MM/dd/yyyy');
  }
  return mdy.replace(reMDY, '$3$1$2');
};

export const subtractDays = (iso: ISODateString, daysToSubtract: number): ISODateString => DateTime.fromISO(iso)
  .minus({ day: daysToSubtract }).toFormat(ISO_DATE_FORMAT);

export const subtractBusinessDays = (startDate: ISODateString, businessDaysToSubtract: number): ISODateString => {
  const bDays = businessDays();
  let dt = DateTime.fromISO(startDate);
  let bDaysToSubtract = businessDaysToSubtract;
  while (bDaysToSubtract) {
    dt = dt.minus({ day: 1 });
    if (bDays.check(dt.toFormat(ISO_DATE_FORMAT))) {
      bDaysToSubtract -= 1;
    }
  }
  return dt.toFormat(ISO_DATE_FORMAT);
};

export const getBusinessDaysInRange = (rangeStart: ISODateString, rangeEnd: ISODateString): ISODateString[] => {
  const bDays = businessDays();
  let dtCursor = DateTime.fromISO(rangeStart);
  const dtEnd = DateTime.fromISO(rangeEnd);
  const businessDates: ISODateString[] = [];
  while (dtCursor <= dtEnd) {
    const iso = dtCursor.toFormat(ISO_DATE_FORMAT);
    if (bDays.check(iso) || config.takeNonBusinessDaysAlso) {
      businessDates.push(iso);
    }
    dtCursor = dtCursor.plus({ day: 1 });
  }
  return businessDates.sort();
};

/**
 * Returns a list of business days obtained by subtracting the "existingPriceDates" list of dates
 * from the "businessDaysToDownload" list.
 * The resulting list is sorted in descending order of dates
 */
export const getReportDates = (existingPriceDates: ISODateString[], businessDaysToDownload: ISODateString[]): ISODateString[] => {
  const reportDates: ISODateString[] = businessDaysToDownload.filter((busyDate) => !existingPriceDates.includes(busyDate));
  return reportDates.sort().reverse();
};

/**
 * Returns the date at which the most recent SOD file is expected
 * APEX promises the appearance of the SOD file for the previous business day (reporting day)
 * at 7 AM EST the next day after the reporting day.
 * If it is now more than 7 AM EST, then we expect the prices for the previous business day (today minus 1 b.d.)
 * If it is less than 7 AM EST now, we expect prices for the first business day prior to yesterday.
 *  (today minus 1 day minus 1  b.d.)
 */
export const getExpectedReportDate = (): ISODateString => {
  const currentDateISO = DateTime.now().toFormat(ISO_DATE_FORMAT);
  if (DateTime.now().hour > config.apexExtracts.hoursNumberAfterWhichSodFileMustBe) {
    return subtractBusinessDays(currentDateISO, 1);
  }
  return subtractBusinessDays(subtractDays(currentDateISO, 1), 1);
};

const getMatchingBracketPosition = (str: string, startIndex = 0): number => {
  const stack = [];
  const matches = str.matchAll(/[{}]/g);
  for (const match of matches) {
    if (startIndex <= match.index) {
      const [bracket] = match;
      if (!stack.length || stack[stack.length - 1] === bracket) {
        stack.push(bracket);
      } else {
        stack.pop();
      }
      if (!stack.length) {
        return match.index;
      }
    }
  }
  return -1;
};

export const truncateVariablesInErrorString = (str: string) => {
  if (str.includes('"variables":')) {
    const index = str.indexOf('{"response":');
    if (index > -1) {
      const left = str.substring(0, index);
      let middle = str.substring(index);
      let right = '';
      const lastIndex = getMatchingBracketPosition(middle);
      if (lastIndex > -1) {
        right = middle.substring(lastIndex + 1);
        middle = middle.substring(0, lastIndex + 1);
        try {
          const json = JSON.parse(middle);
          json.request.variables = `${JSON.stringify(json.request.variables).substring(0, 100)} ...`;
          str = left + JSON.stringify(json) + right;
        } catch (e) {
          //
        }
      }
    }
  }
  return str;
};

export const truncateVariablesInErrorMessage = (err: Error) => {
  const { message } = err;
  if (!message || message.length < 500) {
    return;
  }
  err.message = truncateVariablesInErrorString(err.message);
  err.stack = truncateVariablesInErrorString(err.stack);
};
