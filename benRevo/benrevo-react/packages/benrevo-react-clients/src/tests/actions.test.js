import {
  sendClients,
  updateClient,
  selectClient,
  exportClient,
  importClient,
} from '../actions';
import {
  FETCH_CLIENTS,
  UPDATE_CLIENT,
  SELECT_CLIENT,
  EXPORT_CLIENT,
  IMPORT_CLIENT,
} from '../constants';

describe('ClientPage actions', () => {
  describe('refreshClients', () => {
    it('has a type of FETCH_CLIENTS', () => {
      const expected = {
        type: FETCH_CLIENTS,
      };
      expect(sendClients()).toEqual(expected);
    });

    it('has a type of SELECT_CLIENT', () => {
      const expected = {
        type: SELECT_CLIENT,
        payload: null,
      };
      expect(selectClient(null)).toEqual(expected);
    });

    it('has a type of UPDATE_CLIENT', () => {
      const expected = {
        type: UPDATE_CLIENT,
        payload: { name: 'test', value: '1' },
      };
      expect(updateClient('test', '1')).toEqual(expected);
    });

    it('has a type of EXPORT_CLIENT', () => {
      const expected = {
        type: EXPORT_CLIENT,
      };
      expect(exportClient()).toEqual(expected);
    });

    it('has a type of IMPORT_CLIENT', () => {
      const expected = {
        type: IMPORT_CLIENT,
        payload: {
          file: 'file',
          name: 'test',
          override: true,
          brokerId: 1,
        },
      };
      expect(importClient('file', 'test', true, 1)).toEqual(expected);
    });
  });
});
