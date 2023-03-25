import { combineReducers } from 'redux';
import { reducer as alternatives } from './alternatives';
import { reducer as common } from './common';
import { reducer as documents } from './documents';
import { reducer as enrollment } from './enrollment';
import { reducer as options } from './options';
import { reducer as overview } from './overview';

export default combineReducers({
  alternatives,
  common,
  documents,
  enrollment,
  options,
  overview,
});
