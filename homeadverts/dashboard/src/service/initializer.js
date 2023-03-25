import { messenger } from 'api';
import { loadRooms } from './room/roomLoader';
// import loadUsers from './user/userLoader';
// import { loadStories } from './story/storyLoader';
import { showNotificationDirectDiscussion } from './notification';

export const initializeData = () => (dispatch) => {
  messenger.loadRooms()
    .then((res) => {
      if (res?.data?.length === 0) {
        return false;
      }

      dispatch(loadRooms(res?.data));

      // loadUsers(rooms); // Load users
      // loadStories(rooms); // Load stories

      return false;
    });
};

export const joinUserRoom = user => (dispatch) => {
  messenger.joinUserRoom(user?.id)
    .then((res) => {
      const parts = res?.headers?.location?.split('/');

      localStorage.setItem('roomId', parts[6]); // Bypass and update Room Id
      dispatch(showNotificationDirectDiscussion(user));
      dispatch(initializeData());
    })
    .catch(err => console.log('joinUserRoom', err));
};
