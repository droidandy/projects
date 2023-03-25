import { createTypes } from 'redux-compose-reducer';
import { curry } from 'lodash/fp';
import { postEvent } from './gett';

const TYPES = createTypes('app/devSettings', ['changeField']);

const changeDevSettingField = curry((field, value) => ({ type: TYPES.changeField, payload: { field, value } }));

export const changeShowCarAnimations = value => (dispatch) => {
  dispatch(changeDevSettingField('showCarAnimations', value));
  dispatch(postEvent('app_menu|car_animations|toggle_switched', { new_toggle_position: value }));
};
export const changeShowLocatingCarAnimation = value => (dispatch) => {
  dispatch(changeDevSettingField('showLocatingCarAnimation', value));
  dispatch(postEvent('app_menu|locating_a_car_animation|toggle_switched', { new_toggle_position: value }));
};
export const changeShowSplashScreenAnimation = changeDevSettingField('showSplashScreenAnimation');
