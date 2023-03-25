import produce from 'immer';
import { roomOnlineUpdateAction } from 'action/room';
import { showNotificationUserOnline } from '../notification';

export const buildRoomDetailsLink = (room) => {
  return `/room/${room?.id}`;
};

export const updateOnlineStatuses = members => (dispatch, getState) => {
  const rooms = getState().room.collection;
  const updated = [];

  rooms.forEach((room) => {
    if (members.members[room.admin.id]) {
      room.admin.online = true;
    }

    updated.push(room);
  });

  dispatch(roomOnlineUpdateAction(updated));
};

export const updateOnlineStatusesMemberAdded = member => (dispatch, getState) => {
  const rooms = getState().room.collection;
  const updated = [];

  rooms.forEach((room) => {
    let newState = room;

    if (room.admin.id === Number(member.id)) {
      console.log(`----> ${room.admin.name} is online`);
      dispatch(showNotificationUserOnline(room.admin));

      newState = produce(newState, (draftState) => {
        draftState.admin.online = true;
      });
    }

    updated.push(newState);
  });

  dispatch(roomOnlineUpdateAction(updated));
};

export const updateOnlineStatusesMemberRemoved = member => (dispatch, getState) => {
  const rooms = getState().room.collection;
  const updated = [];

  rooms.forEach((room) => {
    let newState = room;

    if (room.admin.id === Number(member.id)) {
      console.log(`----> ${room.admin.name} is offline`);

      newState = produce(newState, (draftState) => {
        draftState.admin.online = false;
      });
    }

    updated.push(newState);
  });

  dispatch(roomOnlineUpdateAction(updated));
};
