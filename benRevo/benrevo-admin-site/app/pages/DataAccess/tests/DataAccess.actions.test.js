import * as actions from '../actions';
import * as types from '../constants';

describe('DataAccess actions test', () => {
  describe('getGaClients', () => {
    it('has a type of GA_CLIENTS_GET', () => {
      const expected = {
        type: types.GA_CLIENTS_GET,
      };
      expect(actions.getGaClients()).toEqual(expected);
    });
  });
  describe('removeAccessToClient', () => {
    it('has a type of REMOVE_ACCESS_TO_CLIENT', () => {
      const clientId = '123';
      const expected = {
        type: types.REMOVE_ACCESS_TO_CLIENT,
        payload: { clientId },
      };
      expect(actions.removeAccessToClient(clientId)).toEqual(expected);
    });
  });
});
