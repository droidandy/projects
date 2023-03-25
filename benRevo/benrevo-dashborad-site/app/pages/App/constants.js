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

export const CLEAR = 'CLEAR';

export const DEFAULT_LOCALE = 'en';
export const TOGGLE_MOBILE_NAV = 'TOGGLE_MOBILE_NAV';
export const CHECKING_ROLE = 'CHECKING_ROLE';

export const PERSONS_GET = 'app/AppPage/PERSONS_GET';
export const PERSONS_GET_SUCCESS = 'app/AppPage/PERSONS_GET_SUCCESS';
export const PERSONS_GET_ERROR = 'app/AppPage/PERSONS_GET_ERROR';

export const CARRIERS_GET = 'app/AppPage/CARRIERS_GET';
export const CARRIERS_GET_SUCCESS = 'app/AppPage/CARRIERS_GET_SUCCESS';
export const CARRIERS_GET_ERROR = 'app/AppPage/CARRIERS_GET_ERROR';

export const BROKERS_GET = 'app/AppPage/BROKERS_GET';
export const BROKERS_GET_SUCCESS = 'app/AppPage/BROKERS_GET_SUCCESS';
export const BROKERS_GET_ERROR = 'app/AppPage/BROKERS_GET_ERROR';

export const MEDICAL_SECTION = 'medical';
export const DENTAL_SECTION = 'dental';
export const VISION_SECTION = 'vision';

export const FILTER_DATE_FORMAT = 'YYYY/MM/DD';
