import { convertMaskToArray, getInputMask, isWrongChar } from './helpers';

describe('helpers', () => {
  describe('convertMaskToArray', () => {
    it('should return correct array for only digits mask', () => {
      const mask = '9999';
      const arrayMask = ['9', '9', '9', '9'];

      const value = convertMaskToArray(mask);

      expect(value).toEqual(arrayMask);
    });

    it('should return correct array for mask with special chars and digits', () => {
      const mask = '999-999';
      const arrayMask = ['9', '9', '9', '-', '9', '9', '9'];

      const value = convertMaskToArray(mask);

      expect(value).toEqual(arrayMask);
    });

    it('should return correct array for mask with special chars, digits and available chars', () => {
      const mask = '99 ZZ 999999';
      const arrayMask = ['9', '9', ' ', 'Z', 'Z', ' ', '9', '9', '9', '9', '9', '9'];

      const value = convertMaskToArray(mask);

      expect(value).toEqual(arrayMask);
    });

    it('should return correct array for mask with groups of two elements', () => {
      const mask = '99 [9Z][9Z] 999999';
      const arrayMask = ['9', '9', ' ', ['9', 'Z'], ['9', 'Z'], ' ', '9', '9', '9', '9', '9', '9'];

      const value = convertMaskToArray(mask);

      expect(value).toEqual(arrayMask);
    });

    it('should return correct array for mask with groups of multiple elements', () => {
      const mask = '99 [9ЯZz][9Яz] 999999';
      const arrayMask = ['9', '9', ' ', ['9', 'Я', 'Z', 'z'], ['9', 'Я', 'z'], ' ', '9', '9', '9', '9', '9', '9'];

      const value = convertMaskToArray(mask);

      expect(value).toEqual(arrayMask);
    });

    it('should return empty array if empty string', () => {
      const mask = '';
      const arrayMask = [];

      const value = convertMaskToArray(mask);

      expect(value).toEqual(arrayMask);
    });

    it('should return empty array if mask is undefined', () => {
      const mask = undefined;
      const arrayMask = [];

      const value = convertMaskToArray(mask);

      expect(value).toEqual(arrayMask);
    });

    it('should return empty array if mask is null', () => {
      const mask = null;
      const arrayMask = [];

      const value = convertMaskToArray(mask);

      expect(value).toEqual(arrayMask);
    });

    it('should return empty array if mask is regexp', () => {
      const mask = /\d/g;
      const arrayMask = [];

      const value = convertMaskToArray(mask as unknown as string);

      expect(value).toEqual(arrayMask);
    });
  });

  describe('getInputMask', () => {
    it('should return correct mask from correct maskchars array', () => {
      const maskChars = ['9', '9', '9', '9'];
      const mask = '____';

      const value = getInputMask(maskChars);

      expect(value).toBe(mask);
    });

    it('should return correct mask from with spacings and other special chars', () => {
      const maskChars = ['9', '9', ' ', ['9', 'Я', 'Z', 'z'], ['9', 'Я', 'z'], '-', '9', '9', '9', '*', '9', '9', '9'];
      const mask = '__ __-___*___';

      const value = getInputMask(maskChars);

      expect(value).toBe(mask);
    });

    it('should return empty string if it is empty array', () => {
      const maskChars = [];
      const mask = '';

      const value = getInputMask(maskChars);

      expect(value).toBe(mask);
    });

    it('should return empty string if it is null', () => {
      const maskChars = null;
      const mask = '';

      const value = getInputMask(maskChars);

      expect(value).toBe(mask);
    });

    it('should return empty string if it is undefined', () => {
      const maskChars = undefined;
      const mask = '';

      const value = getInputMask(maskChars);

      expect(value).toBe(mask);
    });

    it('should return empty string if it is not an array', () => {
      const maskChars = 123;
      const mask = '';

      const value = getInputMask(maskChars as unknown as []);

      expect(value).toBe(mask);
    });
  });

  describe('isWrongChar', () => {
    it('should return false', () => {
      const char = '9';
      const maskChar = '9';

      const value = isWrongChar(char, maskChar);

      expect(value).toBeFalsy();
    });

    it('should return true', () => {
      const char = '-';
      const maskChar = '9';

      const value = isWrongChar(char, maskChar);

      expect(value).toBeTruthy();
    });

    it('should return true if it is group', () => {
      const char = 'Л';
      const maskChar = ['9', 'Z'];

      const value = isWrongChar(char, maskChar);

      expect(value).toBeTruthy();
    });

    it('should return false if it is group', () => {
      const char = 'J';
      const maskChar = ['9', 'Z'];

      const value = isWrongChar(char, maskChar);

      expect(value).toBeFalsy();
    });

    it('should return true if it wrong matchChar', () => {
      const char = 'J';
      const maskChar = '-';

      const value = isWrongChar(char, maskChar);

      expect(value).toBeTruthy();
    });
  });
});
