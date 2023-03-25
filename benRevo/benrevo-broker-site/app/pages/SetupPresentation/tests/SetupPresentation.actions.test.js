import {
  getOptions,
  getPresentationOptions,
  createAlternative,
  updateAlternativeOption,
  deleteAlternative,
  deleteAlternativeOption,
  addDiscount,
  removeDiscount,
  updateDiscount,
  downloadPresentation,
} from '../actions';
import {
  DOWNLOAD_PRESENTATION,
  GET_PRESENTATION_OPTIONS,
  CREATE_ALTERNATIVE,
  UPDATE_ALTERNATIVE_OPTION,
  DELETE_ALTERNATIVE,
  DELETE_ALTERNATIVE_OPTION,
  GET_OPTIONS,
  ADD_DISCOUNT,
  REMOVE_DISCOUNT,
  UPDATE_DISCOUNT,
} from './../constants';

describe('SetupPresentation actions', () => {
  describe('getOptions', () => {
    const section = 'medical';
    it('has a type of GET_OPTIONS,', () => {
      const expected = {
        type: GET_OPTIONS,
        payload: { section },
      };
      expect(getOptions(section)).toEqual(expected);
    });
  });

  describe('getPresentationOptions', () => {
    it('has a type of GET_PRESENTATION_OPTIONS,', () => {
      const expected = {
        type: GET_PRESENTATION_OPTIONS,
      };
      expect(getPresentationOptions()).toEqual(expected);
    });
  });

  describe('createAlternative', () => {
    it('has a type of CREATE_ALTERNATIVE,', () => {
      const expected = {
        type: CREATE_ALTERNATIVE,
      };
      expect(createAlternative()).toEqual(expected);
    });
  });

  describe('updateAlternativeOption', () => {
    const presentationOptionId = 200;
    const product = 'medical';
    const rfpQuoteOptionId = 100;
    it('has a type of UPDATE_ALTERNATIVE_OPTION,', () => {
      const expected = {
        type: UPDATE_ALTERNATIVE_OPTION,
        payload: { presentationOptionId, product, rfpQuoteOptionId },
      };
      expect(updateAlternativeOption(presentationOptionId, product, rfpQuoteOptionId)).toEqual(expected);
    });
  });

  describe('deleteAlternative', () => {
    const presentationOptionId = 200;
    const index = 200;
    it('has a type of DELETE_ALTERNATIVE,', () => {
      const expected = {
        type: DELETE_ALTERNATIVE,
        payload: { presentationOptionId, index },
      };
      expect(deleteAlternative(presentationOptionId, index)).toEqual(expected);
    });
  });

  describe('deleteAlternativeOption', () => {
    const presentationOptionId = 200;
    const product = 'medical';
    const rfpQuoteOptionId = 100;
    it('has a type of DELETE_ALTERNATIVE_OPTION,,', () => {
      const expected = {
        type: DELETE_ALTERNATIVE_OPTION,
        payload: { presentationOptionId, product, rfpQuoteOptionId },
      };
      expect(deleteAlternativeOption(presentationOptionId, product, rfpQuoteOptionId)).toEqual(expected);
    });
  });

  describe('addDiscount', () => {
    const index = 10;
    it('has a type of ADD_DISCOUNT,', () => {
      const expected = {
        type: ADD_DISCOUNT,
        payload: { index },
      };
      expect(addDiscount(index)).toEqual(expected);
    });
  });

  describe('removeDiscount', () => {
    const index = 10;
    it('has a type of REMOVE_DISCOUNT,', () => {
      const expected = {
        type: REMOVE_DISCOUNT,
        payload: { index },
      };
      expect(removeDiscount(index)).toEqual(expected);
    });
  });

  describe('updateDiscount', () => {
    const discountIndex = 200;
    const index = 100;
    const type = 'medical';
    const value = 'test';
    it('has a type of UPDATE_DISCOUNT,', () => {
      const expected = {
        type: UPDATE_DISCOUNT,
        payload: {
          discountIndex,
          index,
          type,
          value,
        },
      };
      expect(updateDiscount(discountIndex, index, type, value)).toEqual(expected);
    });
  });

  describe('downloadPresentation', () => {
    const clientId = 100;
    const type = 'dental';
    it('has a type of DOWNLOAD_PRESENTATION,', () => {
      const expected = {
        type: DOWNLOAD_PRESENTATION,
        payload: { clientId, type },
      };
      expect(downloadPresentation(clientId, type)).toEqual(expected);
    });
  });
});

