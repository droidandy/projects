import { combineReducers } from 'redux';
import devSettings from './devSettings';
import gett from './gett';
import statuses from './statuses';
import push from './push';
import theme from './theme';

export default combineReducers({
  devSettings,
  gett,
  statuses,
  push,
  theme
});
