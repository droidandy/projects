/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';
export const DEFAULT_LOCALE = 'en';
export const TOGGLE_MOBILE_NAV = 'TOGGLE_MOBILE_NAV';
export const CHECKING_ROLE = 'CHECKING_ROLE';
export const SEND_FEEDBACK = 'SEND_FEEDBACK';
export const OPEN_FEEDBACK_MODAL = 'OPEN_FEEDBACK_MODAL';
export const CLOSE_FEEDBACK_MODAL = 'CLOSE_FEEDBACK_MODAL';

/*
 * Feedback Types
 */
export const FEEDBACK_BUG = 'Report a Bug';
export const FEEDBACK_REQUEST = 'Feature Request';
export const FEEDBACK_COMMENT = 'Positive or Negative Comment';
export const FEEDBACK_OTHER = 'Other';
