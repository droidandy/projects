import {
  isFuture as isFutureFns,
  isPast as isPastFns,
  isValid as isValidFns,
  isAfter as isAfterFns,
  isBefore as isBeforeFns,
  addMonths as addMonthsFns,
  addYears as addYearsFns,
  subYears as subYearsFns,
  isToday,
  parse,
  add,
  intervalToDuration,
  format,
  differenceInCalendarYears,
} from 'date-fns';

export const DATE_FORMAT = 'dd.MM.yyyy';

const parseDate = (date: string) => {
  return parse(date, DATE_FORMAT, new Date());
};

const isValid = (date?: string | null): boolean => {
  if (!date) {
    return true;
  }

  return isValidFns(parseDate(date));
};

const isFuture = (date?: string | null): boolean => {
  if (!date) {
    return true;
  }

  return isFutureFns(parseDate(date));
};

const isPast = (date?: string | null): boolean => {
  if (!date) {
    return true;
  }

  return isPastFns(parseDate(date));
};

const isFutureOrToday = (date?: string | null) => {
  if (!date) {
    return true;
  }

  return isFuture(date) || isToday(parseDate(date));
};

const isPastOrToday = (date?: string | null) => {
  if (!date) {
    return true;
  }

  return isPast(date) || isToday(parseDate(date));
};

const isFutureOrEarlierThanDaysCount = (date?: string | null, daysCount?: number): boolean => {
  if (!date || !daysCount) {
    return true;
  }

  const parsedDate = parseDate(date);
  const dateToCompare = add(new Date(), {
    days: daysCount,
  });

  return isFuture(date) && isBeforeFns(parsedDate, dateToCompare);
};

const isBetweenDaysCount = (date?: string | null, startDaysCount?: number, endDaysCount?: number): boolean => {
  if (!date || !startDaysCount || !endDaysCount) {
    return false;
  }

  const parsedDate = parseDate(date);
  const startDateToCompare = add(new Date(), {
    days: startDaysCount,
  });
  const endDateToCompare = add(new Date(), {
    days: endDaysCount,
  });

  return isAfterFns(parsedDate, startDateToCompare) && isBeforeFns(parsedDate, endDateToCompare);
};

const getYearsInterval = (startDate: string | Date, endDate?: string | Date, withNegative?: boolean): number => {
  if (typeof startDate === 'object') {
    startDate = format(startDate, DATE_FORMAT);
  }
  if (endDate && typeof endDate === 'object') {
    endDate = format(endDate, DATE_FORMAT);
  }

  if (!startDate || (!startDate && !endDate) || !isValid(startDate) || (endDate && !isValid(endDate))) {
    return 0;
  }

  const start = parseDate(startDate);
  const end = endDate ? parseDate(endDate) : new Date();

  if (withNegative) {
    return differenceInCalendarYears(start, end) ?? 0;
  }

  return (
    intervalToDuration({
      start,
      end,
    }).years ?? 0
  );
};

const getMonthsInterval = (startDate: string | Date, endDate?: string | Date, withNegative?: boolean): number => {
  if (typeof startDate === 'object') {
    startDate = format(startDate, DATE_FORMAT);
  }
  if (endDate && typeof endDate === 'object') {
    endDate = format(endDate, DATE_FORMAT);
  }

  if (!startDate || (!startDate && !endDate) || !isValid(startDate) || (endDate && !isValid(endDate))) {
    return 0;
  }

  const start = parseDate(startDate);
  const end = endDate ? parseDate(endDate) : new Date();

  if (withNegative) {
    return differenceInCalendarYears(start, end) ?? 0;
  }
  const duration = intervalToDuration({
    start,
    end,
  });
  return (duration.years || 0) * 12 + (duration.months || 0);
};

const addYearsToDate = (date: string | Date, years: number) => {
  if (typeof date === 'object') {
    date = format(date, DATE_FORMAT);
  }
  return addYearsFns(parseDate(date), years);
};

const subYearsToDate = (date: string | Date, years: number) => {
  if (typeof date === 'object') {
    date = format(date, DATE_FORMAT);
  }
  return subYearsFns(parseDate(date), years);
};

const addMonthsToDate = (date: string | Date, months: number) => {
  if (typeof date === 'object') {
    date = format(date, DATE_FORMAT);
  }
  return addMonthsFns(parseDate(date), months);
};

const isCorrectBirthDate = (birthDate: string, yearsInterval: [number, number], extraMonths?: number) => {
  const age = getYearsInterval(birthDate, format(new Date(), DATE_FORMAT));
  const ageToCompare = extraMonths ? age + extraMonths / 12 : age;

  return age >= yearsInterval[0] && ageToCompare <= yearsInterval[1];
};

export {
  isValid,
  isFuture,
  isPast,
  isFutureOrToday,
  isPastOrToday,
  getYearsInterval,
  isFutureOrEarlierThanDaysCount,
  isBetweenDaysCount,
  getMonthsInterval,
  addYearsToDate,
  subYearsToDate,
  addMonthsToDate,
  parseDate,
  isCorrectBirthDate,
};
