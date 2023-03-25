import { toggleMobileNav, checkingRole, checkVersion, openFeedbackModal, closeFeedbackModal } from '../actions';
import { TOGGLE_MOBILE_NAV, CHECKING_ROLE, OPEN_FEEDBACK_MODAL, CLOSE_FEEDBACK_MODAL } from '../constants';
import { CHECK_VERSION } from '../../../utils/version';

describe('App actions', () => {
  it('toggleMobileNav', () => {
    expect(toggleMobileNav()).toEqual({ type: TOGGLE_MOBILE_NAV });
  });
  it('checkingRole', () => {
    expect(checkingRole('test')).toEqual({ type: CHECKING_ROLE, payload: 'test' });
  });
  it('checkVersion', () => {
    expect(checkVersion('test')).toEqual({ type: CHECK_VERSION, status: 'test' });
  });
  it('openFeedbackModal', () => {
    expect(openFeedbackModal()).toEqual({ type: OPEN_FEEDBACK_MODAL });
  });
  it('closeFeedbackModal', () => {
    expect(closeFeedbackModal()).toEqual({ type: CLOSE_FEEDBACK_MODAL });
  });
});
