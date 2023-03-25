import { isValidIssueDate } from './passport';

describe('passport', () => {
  it('should be valid issue date', () => {
    const birthDate = '01.01.1993';
    const issueDate = '01.01.2013';

    expect(isValidIssueDate(birthDate, issueDate)).toBeTruthy();
  });

  it('should be invalid issue date', () => {
    const birthDate = '01.01.1999';
    const issueDate = '01.01.2013';

    expect(isValidIssueDate(birthDate, issueDate)).toBeFalsy();
  });

  it('should be invalid issue date because of not 14 years old', () => {
    const birthDate = '01.01.2010';
    const issueDate = '01.01.2024';

    expect(isValidIssueDate(birthDate, issueDate)).toBeFalsy();
  });
});
