import {
  requireAuth,
  requireUserMetadata,
  loggedOut,
  popSecret,
  removeSecret,
  storeToken,
} from '../authService/lib';

describe('utils lib', () => {
  describe('requireAuth', () => {
    it('requireAuth defined', () => {
      expect(requireAuth).toBeDefined();
    });
  });

  describe('requireUserMetadata', () => {
    it('requireUserMetadata defined', () => {
      expect(requireUserMetadata).toBeDefined();
    });
  });

  describe('loggedOut', () => {
    it('loggedOut return true', () => {
      expect(loggedOut()).toEqual(true);
    });
  });

  describe('popSecret', () => {
    it('popSecret defined', () => {
      expect(popSecret).toBeDefined();
    });
  });

  describe('removeSecret', () => {
    it('removeSecret defined', () => {
      expect(removeSecret).toBeDefined();
    });
  });

  describe('storeToken', () => {
    it('storeToken return undefined', () => {
      expect(storeToken()).toEqual(undefined);
    });
  });
});
