/**
 * Test  sagas
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import sagaHelper from 'redux-saga-testing';
import { fromJS } from 'immutable';
import { push } from 'react-router-redux';
import { BENREVO_API_PATH } from '../../../config';
import request from '../../../utils/request';
import * as sagas from '../sagas';
import * as types from '../constants';

describe('Team sagas', () => {
  describe('fetchTeam', () => {
    const client = {
      id: 1,
    };
    if (!client.id) throw new Error('No Client Id found');
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/members`;
    const userUrl = `${BENREVO_API_PATH}/v1/accounts/users`;
    const members = [];
    const users = [];
    const allUsers = (users && Array.isArray(users) && users.length > 0) ? users : [];
    let finalUsers = [];

    if (members && Array.isArray(members)) {
      if (members.length) {
        allUsers.map((item) => {
          let add = true;
          members.map((member) => {
            if (item.authId && member.authId && item.authId === member.authId) {
              add = false;
              return true;
            }

            return true;
          });
          if (add) finalUsers.push(item);
          return true;
        });
      } else finalUsers = allUsers;


      finalUsers = finalUsers.concat(members);
    }
    describe('success', () => {
      const it = sagaHelper(sagas.fetchTeam());

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1 };
      });

      it('call the members api', (result) => {
        expect(result).toEqual(call(request, url));
        return [];
      });

      it('call the users api', (result) => {
        expect(result).toEqual(call(request, userUrl));
        return [];
      });


      it('success', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_TEAM_SUCCEEDED, payload: { finalUsers, selected: members } }));
      });
    });

    describe('error client id', () => {
      const it = sagaHelper(sagas.fetchTeam());

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return { };
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_TEAM_FAILED, payload: new Error('No Client Id found') }));
      });
    });

    describe('error users', () => {
      const it = sagaHelper(sagas.fetchTeam());

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1 };
      });

      it('call the members api', (result) => {
        expect(result).toEqual(call(request, url));
        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_TEAM_FAILED, payload: new Error('test') }));
      });
    });

    describe('error members', () => {
      const it = sagaHelper(sagas.fetchTeam());

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return { id: 1 };
      });

      it('call the members api', (result) => {
        expect(result).toEqual(call(request, url));
        return [];
      });

      it('call the users api', (result) => {
        expect(result).toEqual(call(request, userUrl));
        return new Error('test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.FETCH_TEAM_FAILED, payload: new Error('test') }));
      });
    });
  });

  describe('createTeam', () => {
    const client = {
      id: 1,
    };
    const state = fromJS({
      team: {
        selected: [],
        members: [],
      },
    });
    describe('success from rfp', () => {
      const it = sagaHelper(sagas.createTeam({ payload: { fromRfp: true } }));

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return client;
      });

      it('select state', (result) => {
        expect(typeof result).toEqual('object');
        return state;
      });

      it('save succeeded', (result) => {
        let data;
        expect(result).toEqual(put({ type: types.SAVE_TEAM_SUCCEEDED, payload: data }));
      });

      it('change page', (result) => {
        expect(result).toEqual(put(push('/rfp/send-to-carrier')));
      });
    });
    describe('success from /team', () => {
      const it = sagaHelper(sagas.createTeam({ payload: { fromRfp: false } }));

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return client;
      });

      it('select state', (result) => {
        expect(typeof result).toEqual('object');
        return state;
      });

      it('save succeeded', (result) => {
        let data;
        expect(result).toEqual(put({ type: types.SAVE_TEAM_SUCCEEDED, payload: data }));
      });

      it('success notification', (result) => {
        expect(typeof result).toEqual('object');
      });
    });
    describe('error client id from rfp', () => {
      const it = sagaHelper(sagas.createTeam({ payload: { fromRfp: true } }));

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return {};
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SAVE_TEAM_FAILED, payload: new Error('No Client Id found') }));
      });
    });
    describe('error client id from /team', () => {
      const it = sagaHelper(sagas.createTeam({ payload: { fromRfp: false } }));

      it('selectClientRequest', (result) => {
        expect(typeof result).toEqual('object');
        return {};
      });

      it('error notification', (result) => {
        expect(typeof result).toEqual('object');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.SAVE_TEAM_FAILED, payload: new Error('No Client Id found') }));
      });
    });
  });

  describe('deleteTeam', () => {
    const client = {
      id: 1,
    };
    const removeMembers = [];
    const ops = {
      method: 'DELETE',
    };
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/members`;
    ops.body = JSON.stringify(removeMembers);
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const data = { id: 1 };
    describe('success', () => {
      const it = sagaHelper(sagas.deleteTeam(client, removeMembers));
      it('call the api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return data;
      });
      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DELETE_TEAM_SUCCEEDED, payload: data }));
      });
    });
    describe('error client id', () => {
      const it = sagaHelper(sagas.deleteTeam(client, removeMembers));

      it('call the api', (result) => {
        expect(result).toEqual(call(request, url, ops));
        return new Error('Test');
      });

      it('error', (result) => {
        expect(result).toEqual(put({ type: types.DELETE_TEAM_FAILED, payload: new Error('Test') }));
      });
    });
  });

  describe('watchFetchTeam', () => {
    const it = sagaHelper(sagas.watchFetchTeam());

    it('fetchTeam', (result) => {
      expect(result).toEqual(takeLatest(types.FETCH_TEAM_MEMBERS, sagas.fetchTeam));
    });
  });

  describe('watchCreateTeam', () => {
    const it = sagaHelper(sagas.watchCreateTeam());

    it('createTeam', (result) => {
      expect(result).toEqual(takeLatest(types.SAVE_TEAM_MEMBERS, sagas.createTeam));
    });
  });
});
