import { combineReducers } from 'redux';
import user from 'reducer/user';
import room from 'reducer/room';
import story from 'reducer/story';
import message from 'reducer/message';
import notification from 'reducer/notification';
import search from 'reducer/search';
import nav from 'reducer/nav';

export default asyncReducers => combineReducers({
  user,
  room,
  story,
  message,
  notification,
  search,
  nav,
  ...asyncReducers,
});
