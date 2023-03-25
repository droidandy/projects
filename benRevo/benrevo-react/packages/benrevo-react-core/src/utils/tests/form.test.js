/**
 * Test the isFormValid function
 */

import { isFormValid, scrollToInvalid } from '../form';

describe('isFormValid', () => {
  it('should isFormValid return true', () => {
    const testScope = {
      setState: jest.fn(),
    };
    const testValidator = {
      name: 'test',
      isValid: jest.fn(),
    };
    expect(isFormValid(testScope, [testValidator])).toBe(true);
  });

  it('should isFormValid throw err', () => {
    const testScope = {
      setState: jest.fn(),
    };
    expect(() => {
      isFormValid(testScope);
    }).toThrowError();
  });
});

describe('scrollToInvalid', () => {
  it('should be defined', () => {
    expect(scrollToInvalid()).toBeDefined();
  });
});
