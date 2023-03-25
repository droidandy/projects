import { createSelector } from 'reselect';
import {
  EMAIL,
  PICTURE,
  BROKERAGE,
  USER_METADATA,
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

export const selectUserMetadata = () => createSelector(
  selectProfile(),
  (profile) => profile.get(USER_METADATA),
);
