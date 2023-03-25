import {
  getValidationStatus,
  getMarketingStatusList,
  selectClientsCarrier,
  updateCarrierList,
  updateMarketingStatusItem,
  getBrokerPrograms,
  deleteCarrier,
  getCLSAQuote,
  resetZip,
  zipSuccessCall,
  clsaModalOpen,
  clsaModalClose,
  getNextCLSA,
  checkUHCAction,
} from '../actions';
import {
  GET_VALIDATE,
  GET_MARKETING_STATUS_LIST,
  SELECT_CLIENTS_CARRIER,
  SAVE_MARKETING_STATUS_LIST,
  SAVE_MARKETING_STATUS_LIST_ITEM,
  GET_PROGRAMS,
  DELETE_CARRIE_ITEM,
  GET_CLSA_QUOTE,
  RESET_ZIP,
  ZIP_SUCCESS_CALL,
  CLSA_MODAL_OPEN,
  CLSA_MODAL_CLOSE,
  GET_NEXT_CLSA,
  CHECK_UHC,
} from './../../constants';

describe('Client actions', () => {
  describe('getValidationStatus', () => {
    const clientId = '1';
    it('has a type of GET_VALIDATE', () => {
      const expected = {
        type: GET_VALIDATE,
        payload: clientId,
      };
      expect(getValidationStatus(clientId)).toEqual(expected);
    });
  });
  describe('getMarketingStatusList', () => {
    it('has a type of GET_MARKETING_STATUS_LIST', () => {
      const clientId = '1';
      const expected = {
        type: GET_MARKETING_STATUS_LIST,
        payload: clientId,
      };
      expect(getMarketingStatusList(clientId)).toEqual(expected);
    });
  });
  describe('selectClientsCarrier', () => {
    it('has a type of SELECT_CLIENTS_CARRIER', () => {
      const carrier = { carrierName: 'anthem' };
      const section = 'medical';
      const expected = {
        type: SELECT_CLIENTS_CARRIER,
        payload: { carrier, section },
      };
      expect(selectClientsCarrier(carrier, section)).toEqual(expected);
    });
  });
  describe('updateCarrierList', () => {
    it('has a type of SAVE_MARKETING_STATUS_LIST', () => {
      const clientId = '1';
      const section = 'medical';
      const expected = {
        type: SAVE_MARKETING_STATUS_LIST,
        payload: { clientId },
        meta: { section },
      };
      expect(updateCarrierList(clientId, section)).toEqual(expected);
    });
  });
  describe('updateMarketingStatusItem', () => {
    it('has a type of SAVE_MARKETING_STATUS_LIST_ITEM', () => {
      const itemId = 1;
      const marketingStatus = 'status';
      const clientId = '123';
      const expected = {
        type: SAVE_MARKETING_STATUS_LIST_ITEM,
        payload: { itemId, marketingStatus, clientId },
      };
      expect(updateMarketingStatusItem(itemId, marketingStatus, clientId)).toEqual(expected);
    });
  });
  describe('getBrokerPrograms', () => {
    it('has a type of GET_PROGRAMS', () => {
      const brokerId = 123;
      const expected = {
        type: GET_PROGRAMS,
        payload: brokerId,
      };
      expect(getBrokerPrograms(brokerId)).toEqual(expected);
    });
  });
  describe('deleteCarrier', () => {
    it('has a type of DELETE_CARRIE_ITEM', () => {
      const clientId = 123;
      const carrierItem = { no: 'test' };
      const section = 'medical';
      const expected = {
        type: DELETE_CARRIE_ITEM,
        payload: { clientId, carrierItem },
        meta: { section },
      };
      expect(deleteCarrier(clientId, carrierItem, section)).toEqual(expected);
    });
  });
  describe('getCLSAQuote', () => {
    it('has a type of GET_CLSA_QUOTE', () => {
      const zip = 12345;
      const number = 123467;
      const age = 20;
      const programId = 50;
      const section = 'medical';
      const expected = {
        type: GET_CLSA_QUOTE,
        payload: {
          zip,
          number,
          age,
          programId,
          section,
        },
      };
      expect(getCLSAQuote(zip, number, age, programId, section)).toEqual(expected);
    });
  });
  describe('resetZip', () => {
    it('has a type of RESET_ZIP', () => {
      const expected = {
        type: RESET_ZIP,
      };
      expect(resetZip()).toEqual(expected);
    });
  });
  describe('zipSuccessCall', () => {
    it('has a type of ZIP_SUCCESS_CALL', () => {
      const payload = { data: 'test' };
      const expected = {
        type: ZIP_SUCCESS_CALL,
        payload,
      };
      expect(zipSuccessCall(payload)).toEqual(expected);
    });
  });
  describe('clsaModalOpen', () => {
    it('has a type of CLSA_MODAL_OPEN', () => {
      const expected = {
        type: CLSA_MODAL_OPEN,
      };
      expect(clsaModalOpen()).toEqual(expected);
    });
  });
  describe('clsaModalClose', () => {
    it('has a type of CLSA_MODAL_CLOSE', () => {
      const expected = {
        type: CLSA_MODAL_CLOSE,
      };
      expect(clsaModalClose()).toEqual(expected);
    });
  });
  describe('getNextCLSA', () => {
    it('has a type of GET_NEXT_CLSA', () => {
      const programId = 124;
      const section = 'medical';
      const expected = {
        type: GET_NEXT_CLSA,
        payload: { programId, section },
      };
      expect(getNextCLSA(programId, section)).toEqual(expected);
    });
  });
  describe('checkUHCAction', () => {
    it('has a type of CHECK_UHC', () => {
      const section = 'medical';
      const id = '123';
      const expected = {
        type: CHECK_UHC,
        payload: { section, id },
      };
      expect(checkUHCAction(section, id)).toEqual(expected);
    });
  });
});
