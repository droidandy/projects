import { convertToDBFormat } from './date';

describe('date', () => {
  it('should return correct date is US format', () => {
    const date = '01.02.2020';
    const convertedDate = convertToDBFormat(date);

    expect(convertedDate).toBe('2020-02-01');
  });

  it('should return null because of incorrect format of input date', () => {
    const date = '02-01-2020';
    const convertedDate = convertToDBFormat(date);

    expect(convertedDate).toBeNull();
  });

  it('should return null because of incorrect date', () => {
    const date = '01-01-kkk321321';
    const convertedDate = convertToDBFormat(date);

    expect(convertedDate).toBeNull();
  });
});
