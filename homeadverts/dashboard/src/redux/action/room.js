import { room } from 'type';

export const roomSearchAction = payload => ({ type: room.ROOM_SEARCH, payload });

export const roomSelectAction = payload => ({ type: room.ROOM_SELECT, payload });

export const roomUnSelectAction = () => ({ type: room.ROOM_UNSELECT });

export const roomCollectionLoadSuccessAction = (collection, selected) => ({
  type: room.ROOM_COLLECTION_LOAD_SUCCESS,
  payload: { collection, selected },
});

export const roomDetailsLoadSuccessAction = payload => ({
  type: room.ROOM_DETAILS_LOAD_SUCCESS,
  payload,
});

export const roomOnlineUpdateAction = payload => ({ type: room.ROOM_ONLINE_UPDATE, payload });

export const updateRoomDetails = payload => ({ type: room.UPDATE_ROOM_DETAILS, payload });
