import { isFuture, isPast, isValid, getYearsInterval, isFutureOrEarlierThanDaysCount } from './date';

describe('date', () => {
  it('should be valid date', () => {
    const date = '07.06.1993';

    expect(isValid(date)).toBeTruthy();
  });

  it('should not be valid date', () => {
    const date = '32.99.8372';

    expect(isValid(date)).toBeFalsy();
  });

  it('should not be valid date', () => {
    const date = '30.02.2020';

    expect(isValid(date)).toBeFalsy();
  });

  it('should not be valid date', () => {
    const date = '01.30.2020';

    expect(isValid(date)).toBeFalsy();
  });

  it('should be future', () => {
    const date = '01.01.2030';

    expect(isFuture(date)).toBeTruthy();
  });

  it('should not be future', () => {
    const date = '01.01.1990';

    expect(isFuture(date)).toBeFalsy();
  });

  it('should be past', () => {
    const date = '01.01.1990';

    expect(isPast(date)).toBeTruthy();
  });

  it('should not be past', () => {
    const date = '01.01.2030';

    expect(isPast(date)).toBeFalsy();
  });

  it('should be more or equal than 18 years', () => {
    const startDate = '01.01.2000';
    const endDate = '01.01.2020';

    expect(getYearsInterval(startDate, endDate)).toBeGreaterThanOrEqual(18);
  });

  it('should be equal 14 years', () => {
    const startDate = '01.01.2000';
    const endDate = '01.01.2014';

    expect(getYearsInterval(startDate, endDate)).toBe(14);
  });

  it('should be more than 5 years till today', () => {
    const startDate = '01.01.2015';

    expect(getYearsInterval(startDate)).toBeGreaterThanOrEqual(5);
  });

  it('should not be tomorrow or less than 60 days in future', () => {
    const startDate = '01.01.2020';

    expect(isFutureOrEarlierThanDaysCount(startDate, 60)).toBeFalsy();
  });
});
