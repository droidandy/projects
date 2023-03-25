import {
  FETCH_CLIENTS,
} from './../constants';
import { sendClients } from './../actions';

describe('Carrier actions', () => {
  describe('sendClients', () => {
    it('has a type of FETCH_CLIENTS', () => {
      const expected = {
        type: FETCH_CLIENTS,
        payload: { test: 'test' },
      };
      expect(sendClients({ test: 'test' })).toEqual(expected);
    });
  });
});
