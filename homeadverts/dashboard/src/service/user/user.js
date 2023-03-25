import { authorizeSuccessAction, userCollectionLoad } from 'action/user';
import { updateRoomDetails } from 'action/room';
import route from 'config/route';
import { messenger } from 'api';
import { subscribePusherUserChannel, subscribePusherOnlineChannel } from '../pusher';
import { showNotificationUserFollowingAdded, showNotificationUserFollowingRemoved } from '../notification';

export const readUserFromStorage = () => (dispatch, getState) => {
  const { selected } = getState().room;
  const users = getState().user.collection;

  if (users?.length && selected?.id) {
    // Search in store
    return users.find(item => Number(item.id) === Number(selected.admin.id));
  }

  if (selected.id) {
    return selected.admin;
  }

  return false;
};

export const authorizeUser = () => (dispatch) => {
  messenger.getCurrentUser()
    .then((res) => {
      if (res?.data == null) {
        location.href = route.URL_INDEX;
      } else {
        const user = res?.data;

        dispatch(subscribePusherUserChannel(user));
        dispatch(subscribePusherOnlineChannel());
        dispatch(authorizeSuccessAction(user));
      }
    });
};

const updateUserInStorage = () => (dispatch, getState) => {
  const details = getState().room.details;
  const users = getState().user.collection;
  const isFollowing = details?.admin?.isFollowing || false;
  const updated = [];

  if (isFollowing) {
    dispatch(showNotificationUserFollowingRemoved(details?.admin));
  } else {
    dispatch(showNotificationUserFollowingAdded(details?.admin));
  }

  users.forEach((u) => {
    if (u?.id === details?.admin?.id) {
      u.isFollowing = !u.isFollowing;
    }

    updated.push(u);
  });
  const followers = (details?.admin?.counters?.followers || 0) + (isFollowing ? -1 : 1);
  const updatedDetails = {
    admin: {
      ...(details?.admin || {}),
      isFollowing: !isFollowing,
      counters: {
        ...(details?.admin?.counters || {}),
        followers,
      },
    },
  };
  dispatch(updateRoomDetails(updatedDetails));
  dispatch(userCollectionLoad(updated));
};

export const followUser = user => (dispatch) => {
  messenger.followUser(user?.url?.follow, user?.isFollowing)
    .then(() => dispatch(updateUserInStorage()));
};
