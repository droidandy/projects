import { messageTextFlushAction } from 'action/message';
import {
  roomCollectionLoadSuccessAction, roomDetailsLoadSuccessAction, roomSearchAction,
  roomSelectAction,
} from 'action/room';
import { userSearchClear } from 'action/search';
import { messenger } from 'api';
import { isMobile } from 'helper/common';
import { loadMessages } from '../message/loader';

const getSelectedRoom = (rooms) => {
  const idFromStorage = localStorage.getItem('roomId');
  let selected = rooms[0];

  rooms.forEach((room) => {
    if (room.id === Number(idFromStorage)) {
      selected = room;
    }
  });

  return selected;
};

const loadRoomDetails = roomId => (dispatch) => {
  messenger.loadRoomDetails(roomId)
    .then(res => dispatch(roomDetailsLoadSuccessAction(res?.data)));
};

const decorateRooms = (collection) => {
  const items = [];

  collection.forEach((room) => {
    if (room.user) {
      room.photo = room.user.photo;
      room.company = room.user.company;
    }
    if (room.article) {
      room.photo = room.article.thumbnail.s;
    }
    if (room.property) {
      room.photo = room.property.thumbnail.s;
    }

    room.name = room.title;

    items.push(room);
  });

  return items.sort((a, b) => {
    if (b.lastMessage && a.lastMessage) {
      return b.lastMessage.timestamp - a.lastMessage.timestamp;
    }

    return -a.timestamp;
  });
};

export const selectRoom = room => (dispatch) => {
  localStorage.setItem('roomId', room.id);

  dispatch(roomSelectAction(room));
  dispatch(messageTextFlushAction());

  dispatch(loadMessages(room));
  dispatch(loadRoomDetails(room?.id));
};

export const loadRooms = data => (dispatch) => {
  const collection = decorateRooms(data);
  const selected = isMobile.any() ? null : getSelectedRoom(collection);

  dispatch(roomSearchAction(''));
  dispatch(userSearchClear());
  dispatch(roomCollectionLoadSuccessAction(collection, selected));
  if (selected) {
    dispatch(roomSelectAction(selected));

    dispatch(loadMessages(selected)); // Load messages for the last selected room
    dispatch(loadRoomDetails(selected?.id)); // Load details for the last selected room
  }

  return collection;
};
