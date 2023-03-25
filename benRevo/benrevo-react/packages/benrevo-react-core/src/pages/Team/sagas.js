import { call, put, takeLatest, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { success, error } from 'react-notification-system-redux';
import { BENREVO_API_PATH } from '../../config';
import request from '../../utils/request';
import { FETCH_TEAM_SUCCEEDED, FETCH_TEAM_FAILED,
  FETCH_TEAM_MEMBERS, SAVE_TEAM_MEMBERS, SAVE_TEAM_SUCCEEDED, SAVE_TEAM_FAILED,
  DELETE_TEAM_SUCCEEDED, DELETE_TEAM_FAILED } from './constants';
import { selectClientRequest } from './selectors';

export function* fetchTeam() {
  try {
    const client = yield select(selectClientRequest());
    if (!client.id) throw new Error('No Client Id found');
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/members`;
    const members = yield call(request, url);
    const userUrl = `${BENREVO_API_PATH}/v1/accounts/users`;
    const users = yield call(request, userUrl);
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
    yield put({ type: FETCH_TEAM_SUCCEEDED, payload: { finalUsers, selected: members } });
  } catch (err) {
    yield put({ type: FETCH_TEAM_FAILED, payload: err });
  }
}

export function* createTeam(action) {
  const ops = {
    method: 'POST',
  };
  const notificationOpts = {
    message: 'Client team was successfully saved.',
    position: 'tc',
    autoDismiss: 5,
  };

  try {
    const client = yield select(selectClientRequest());

    if (!client.id) throw new Error('No Client Id found'); // todo ford handle this better.
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/members`;
    const state = yield select();
    const selected = state.get('team').get('selected').toArray();
    const members = state.get('team').get('members');
    const body = [];
    const removeMembers = [];
    selected.forEach((item) => {
      let add = true;
      members.map((member) => {
        if (member.get('authId') === item.get('authId') && member.get('id')) {
          add = false;
          return true;
        }
        return true;
      });
      if (add) {
        body.push({
          ...item.toJS(),
          brokerageId: client.brokerId,
        });
      }
      return true;
    });

    members.map((member) => {
      if (member.get('id')) {
        let remove = false;

        selected.forEach((item) => {
          if (member.get('authId') === item.get('authId')) {
            remove = true;
            return remove;
          }

          return true;
        });

        if (!remove) removeMembers.push(member.toJS());
      }
      return true;
    });


    ops.body = JSON.stringify(body);
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    let data;

    if (body.length) {
      data = yield call(request, url, ops);
    }


    if (removeMembers.length) {
      yield* deleteTeam(client, removeMembers);
    }


    yield put({ type: SAVE_TEAM_SUCCEEDED, payload: data });

    if (action.payload.fromRfp) {
      yield put(push(`${action.payload.prefix || ''}/rfp/send-to-carrier`));
    } else {
      yield put(success(notificationOpts));
    }
  } catch (err) {
    if (!action.payload.fromRfp) {
      notificationOpts.message = 'Error occurred when saving client team.';
      yield put(error(notificationOpts));
    }
    yield put({ type: SAVE_TEAM_FAILED, payload: err });
  }
}

export function* deleteTeam(client, removeMembers) {
  const ops = {
    method: 'DELETE',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/members`;
    ops.body = JSON.stringify(removeMembers);
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');

    const data = yield call(request, url, ops);

    yield put({ type: DELETE_TEAM_SUCCEEDED, payload: data });
  } catch (err) {
    yield put({ type: DELETE_TEAM_FAILED, payload: err });
  }
}

export function* watchFetchTeam() {
  yield takeLatest(FETCH_TEAM_MEMBERS, fetchTeam);
}

export function* watchCreateTeam() {
  yield takeLatest(SAVE_TEAM_MEMBERS, createTeam);
}

export default [
  watchFetchTeam,
  watchCreateTeam,
];
