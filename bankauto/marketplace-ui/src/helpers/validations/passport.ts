import { isAfter, isBefore, isEqual } from 'date-fns';
import { addMonthsToDate, addYearsToDate, getYearsInterval, parseDate, subYearsToDate } from './date';

const isValidIssueDate = (birthDate: string, issueDate: string) => {
  const age = getYearsInterval(birthDate, new Date());
  const passportIssuedAtAge = getYearsInterval(birthDate, issueDate!);

  if (age >= 14 && age < 20 && passportIssuedAtAge >= 14) {
    return true;
  }

  if (age >= 20 && age < 45 && passportIssuedAtAge >= 20) {
    return true;
  }

  if (age >= 45 && passportIssuedAtAge >= 45) {
    return true;
  }

  return false;
};

const isIssueDateLess10 = (issueDate: string) => {
  const startIssueInterval = subYearsToDate(new Date(), 10);

  return isAfter(parseDate(issueDate), startIssueInterval) || isEqual(parseDate(issueDate), startIssueInterval);
};

const isIssueDateMore20 = (birthDate: string, issueDate: string) => {
  const age = getYearsInterval(birthDate, new Date());
  const startIssueInterval = addYearsToDate(birthDate, 20);
  const endIssueInterval = addYearsToDate(birthDate, 45);

  if (age >= 20 && age < 45) {
    if (isAfter(parseDate(issueDate), startIssueInterval) && isBefore(parseDate(issueDate), endIssueInterval)) {
      return true;
    }
    if (isBefore(new Date(), addMonthsToDate(startIssueInterval, 1))) {
      return true;
    }
    return false;
  }
  return true;
};

const isIssueDateMore45 = (birthDate: string, issueDate: string) => {
  const age = getYearsInterval(birthDate, new Date());
  const startIssueInterval = addYearsToDate(birthDate, 45);

  if (age >= 45) {
    if (isAfter(parseDate(issueDate), startIssueInterval)) {
      return true;
    }
    if (isBefore(new Date(), addMonthsToDate(startIssueInterval, 1))) {
      return true;
    }
    return false;
  }
  return true;
};

export { isValidIssueDate, isIssueDateLess10, isIssueDateMore20, isIssueDateMore45 };
