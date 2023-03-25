import moment from 'moment';
import * as types from './constants';

export const getInitials = (name = '') => {
  const initials = name.replace(/[^a-zA-Z- ]/g, '').match(/\b\w/g);

  if (initials && initials.length) {
    initials.splice(2, initials.length - 2);
    initials.join('');
  }

  return initials;
};

export const mappingClientState = (state) => {
  let clientState = '';
  if (state === types.RFP_SUBMITTED_STATE) clientState = types.RFP_SUBMITTED_NORMAL;
  else if (state === types.RFP_STARTED_STATE) clientState = types.RFP_STARTED_NORMAL;
  else if (state === types.QUOTED_STATE) clientState = types.QUOTED_NORMAL;
  else if (state === types.SUBMITTED_FOR_APPROVAL_STATE) clientState = types.SUBMITTED_FOR_APPROVAL_NORMAL;
  else if (state === types.ON_BOARDING_STATE) clientState = types.ON_BOARDING_NORMAL;
  else if (state === types.PENDING_APPROVAL_STATE) clientState = types.PENDING_APPROVAL_NORMAL;
  else if (state === types.POLICY_FINALIZED_STATE) clientState = types.POLICY_FINALIZED_NORMAL;
  else if (state === types.COMPLETED_STATE) clientState = types.COMPLETED_NORMAL;
  else if (state === types.SOLD_STATE) clientState = types.SOLD_NORMAL;
  else if (state === types.CLOSED_STATE) clientState = types.CLOSED_NORMAL;
  else if (state === types.WON_STATE) clientState = types.WON_NORMAL;

  return clientState;
};

export const getDate = (unix, format = 'MM.DD.YY') => moment(new Date(unix)).utc().format(format);
