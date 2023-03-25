import { fromJS } from 'immutable';
import reducer from '../reducer';

import {
  SEND_FEEDBACK_ERROR,
  SEND_FEEDBACK_SUCCESS,
} from './../../../utils/authService/constants';

import * as utilActions from './../../../utils/authService/actions';

import * as actions from '../actions';

describe('reducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      loading: false,
      error: false,
      currentUser: false,
      showMobileNav: false,
      checkingRole: true,
      feedbackModalOpen: false,
    });
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });

  it('TOGGLE_MOBILE_NAV', () => {
    const mockAction = actions.toggleMobileNav();
    const mockState = state
      .set('showMobileNav', !state.get('showMobileNav'));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHECKING_ROLE', () => {
    const mockAction = actions.checkingRole();
    const mockState = state
      .set('checkingRole', mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_FEEDBACK', () => {
    const mockAction = utilActions.sendFeedback();
    const mockState = state
      .set('loading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_FEEDBACK_SUCCESS', () => {
    const mockAction = { type: SEND_FEEDBACK_SUCCESS };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_FEEDBACK_ERROR', () => {
    const mockAction = { type: SEND_FEEDBACK_ERROR };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('OPEN_FEEDBACK_MODAL', () => {
    const mockAction = actions.openFeedbackModal();
    const mockState = state
      .set('feedbackModalOpen', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLOSE_FEEDBACK_MODAL', () => {
    const mockAction = actions.closeFeedbackModal();
    const mockState = state
      .set('feedbackModalOpen', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});
