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

export const DEFAULT_LOCALE = 'en';
export const TOGGLE_MOBILE_NAV = 'TOGGLE_MOBILE_NAV';

export const CHANGE_FORM = 'boilerplate/App/CHANGE_REQUEST_DEMO_FORM';

export const FORM_SUBMIT = 'boilerplate/App/REQUEST_DEMO_FORM_SUBMIT';
export const FORM_SUBMIT_SUCCESS = 'boilerplate/App/REQUEST_DEMO_FORM_SUBMIT_SUCCESS';
export const FORM_SUBMIT_ERROR = 'boilerplate/App/REQUEST_DEMO_FORM_SUBMIT_ERROR';
