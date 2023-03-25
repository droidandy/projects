import {
  selectProfileMeta,
} from './../selectors';

describe('Carrier selectors', () => {
  describe('selectProfileMeta', () => {
    it('should be defined', () => {
      expect(selectProfileMeta()).toBeDefined();
    });
  });
});
