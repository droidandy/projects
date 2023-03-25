import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import navigator from '../navigator';
import panel from '../panel';
import auth from '../auth/authReducer';
import register from '../register';
import utility from '../utility';
import map from '../map';
import conversations from '../conversations';
import selectedConversation from '../selectedConversation';

export default combineReducers({
  form: reduxForm,
  navigator,
  panel,
  auth,
  register,
  utility,
  map,
  conversations,
  selectedConversation
});
