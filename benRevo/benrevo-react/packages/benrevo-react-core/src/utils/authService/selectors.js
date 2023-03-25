import { createSelector } from 'reselect';
import {
  EMAIL,
  PICTURE,
  BROKERAGE,
  FIRST_NAME,
  LAST_NAME,
} from './reducer';

const selectProfile = () => (state) => state.get('profile');

export const selectEmail = () => createSelector(
  selectProfile(),
  (profile) => profile.get(EMAIL),
);

export const selectBrokerage = () => createSelector(
  selectProfile(),
  (profile) => profile.get(BROKERAGE),
);

export const selectPicture = () => createSelector(
  selectProfile(),
  (profile) => profile.get(PICTURE),
);

export const selectUserName = () => createSelector(
  selectProfile(),
  (profile) => ({ firstName: profile.get(FIRST_NAME), lastName: profile.get(LAST_NAME) }),
);

