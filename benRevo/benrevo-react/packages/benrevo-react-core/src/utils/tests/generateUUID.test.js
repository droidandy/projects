/**
 * Test the generateUUID function
 */

import generateUUID from '../generateUUID';

describe('generateUUID', () => {
  it('should generateUUID return string', () => {
    expect(typeof generateUUID()).toBe('string');
  });

  it('should generateUUID return string length', () => {
    expect(generateUUID().length).toBe(36);
  });
});
