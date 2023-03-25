import { notificationShowAction, notificationHideAction } from 'action/notification';

const NOTIFICATION = {
  1: name => `💡 Direct discussion - ${name}`,
  2: name => `💡 Public talk - ${name}`,
  3: name => `💡 You started following ${name}`,
  4: name => `💡 You stopped following ${name}`,
  5: name => `💡 You liked ${name}`,
  6: name => `💡 You disliked ${name}`,
  7: name => `💡 ${name} is Online`,
};

const notify = text => (dispatch) => {
  dispatch(notificationShowAction(text));

  setTimeout(() => {
    dispatch(notificationHideAction);
  }, 3000);
};

export const onBoardingShow = () => (dispatch) => {
  const urlParams = new URLSearchParams(window.location.search);
  const channel = Number(urlParams.get('channel'));
  const name = urlParams.get('name');

  if (channel) {
    setTimeout(() => {
      dispatch(notify(NOTIFICATION[channel](name)));
    }, 3000);
  }
};

export const showNotificationDirectDiscussion = user => (dispatch) => {
  dispatch(notify(NOTIFICATION[1](user.name)));
};
export const showNotificationLikeAdded = story => (dispatch) => {
  dispatch(notify(NOTIFICATION[5](story.title)));
};
export const showNotificationLikeRemoved = story => (dispatch) => {
  dispatch(notify(NOTIFICATION[6](story.title)));
};
export const showNotificationUserFollowingAdded = user => (dispatch) => {
  dispatch(notify(NOTIFICATION[3](user.name)));
};
export const showNotificationUserFollowingRemoved = user => (dispatch) => {
  dispatch(notify(NOTIFICATION[4](user.name)));
};
export const showNotificationUserOnline = user => (dispatch) => {
  dispatch(notify(NOTIFICATION[7](user.name)));
};
