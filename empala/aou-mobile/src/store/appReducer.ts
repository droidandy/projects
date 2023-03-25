/**
 * Action Types
 */
export const SET_BUSY = 'APP/SET_BUSY';
export const SET_READY = 'APP/SET_READY';

export const SHOW_TOAST_SUCCESS = 'APP/SHOW_TOAST_SUCCESS';
export const SHOW_TOAST_ERROR = 'APP/SHOW_TOAST_ERROR';

export const FETCH_ETNA_COOKIE = 'APP/FETCH_ETNA_COOKIE';
export const SIGN_OUT = 'APP/SIGN_OUT';
export const SET_HAS_ETNA_COOKIE = 'APP/SET_HAS_ETNA_COOKIE';

export const SET_CURRENT_ROUTER = 'APP/SET_CURRENT_ROUTER';

export const SET_PLATFORM_MESSAGE = 'APP/PLATFORM_MESSAGE/SET';
export const FETCH_PLATFORM_MESSAGE = 'APP/PLATFORM_MESSAGE/FETCH';

export const SET_NOTIFICATIONS = 'APP/NOTIFICATIONS/SET';
export const MARK_AS_READ_NOTIFICATIONS = 'APP/NOTIFICATIONS/MARK_AS_READ';
export const DISMISS_NOTIFICATIONS = 'APP/NOTIFICATIONS/DISMISS';
export const EXECUTE_CTA_NOTIFICATIONS = 'APP/NOTIFICATIONS/EXECUTE_CTA';

export const CHECK_IS_ETNA_MOBILE_APP = 'APP/CHECK_IS_ETNA_MOBILE_APP';
export const SET_IS_ETNA_MOBILE_APP = 'APP/SET_IS_ETNA_MOBILE_APP';

export const WS_EMIT = 'APP/WS_EMIT';

/**
 * Action Creators
 */
export const setBusy = (busy, scrim = false) => ({ type: SET_BUSY, busy, scrim });
export const setReady = (ready) => ({ type: SET_READY, ready });
export const showToastSuccess = (toastMessage) => ({ type: SHOW_TOAST_SUCCESS, toastMessage });
export const showToastError = (toastMessage, important) => ({ type: SHOW_TOAST_ERROR, toastMessage, important });

export const fetchEtnaCookie = () => ({ type: FETCH_ETNA_COOKIE });
export const signOut = () => ({ type: SIGN_OUT });
export const setHasEtnaCookie = (hasEtnaCookie) => ({ type: SET_HAS_ETNA_COOKIE, hasEtnaCookie });

export const setCurrentRouter = (routerName) => ({ type: SET_CURRENT_ROUTER, routerName });

export const setPlatformMessage = (platformMessage) => ({ type: SET_PLATFORM_MESSAGE, platformMessage });
export const fetchPlatformMessage = (messageType) => ({ type: FETCH_PLATFORM_MESSAGE, messageType });

export const setNotifications = (notifications) => ({ type: SET_NOTIFICATIONS, notifications });
export const markAsReadNotifications = (notification) => ({ type: MARK_AS_READ_NOTIFICATIONS, notification });
export const dismissNotifications = (notification) => ({ type: DISMISS_NOTIFICATIONS, notification });
export const executeCTANotifications = (notification) => ({ type: EXECUTE_CTA_NOTIFICATIONS, notification });

export const checkIsEtnaMobileApp = () => ({ type: CHECK_IS_ETNA_MOBILE_APP });
export const setIsEtnaMobileApp = (isEtnaMobileApp) => ({ type: SET_IS_ETNA_MOBILE_APP, isEtnaMobileApp });

export const wsEmit = ({ event, payload = {} }) => ({ type: WS_EMIT, event, payload });

/**
 * Initial State
 */
const initialState = {
  busy: 0,
  scrim: false,
  ready: false,
  hasEtnaCookie: false,
  ws_topic_subscriptions: [],
  platformMessage: {},
  isEtnaMobileApp: false,
  notifications: {
    count: 0,
    items: [],
  },
};

/**
 * Reducer
 */
export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BUSY:
      // eslint-disable-next-line no-case-declarations
      const newBusy = state.busy + (action.busy ? 1 : -1);
      return { ...state, busy: newBusy < 0 ? 0 : newBusy, scrim: action.scrim };
    case SET_READY:
      return { ...state, ready: action.ready };

    case SHOW_TOAST_SUCCESS:
      // toast.success(action.toastMessage);
      return state;

    case SHOW_TOAST_ERROR:
      // toast.error(action.toastMessage, { autoClose: action.important ? 6000 : 1200 });
      return state;

    case SET_HAS_ETNA_COOKIE:
      return { ...state, hasEtnaCookie: action.hasEtnaCookie };
    case SET_CURRENT_ROUTER:
      return { ...state, currentRouter: action.routerName };

    case SET_PLATFORM_MESSAGE:
      return { ...state, platformMessage: action.platformMessage };

    case SET_NOTIFICATIONS: {
      const notifications = {
        items: action.notifications.items,
        count: action.notifications.items.filter((n) => n.unread).length,
      };
      return { ...state, notifications };
    }

    case SET_IS_ETNA_MOBILE_APP:
      return { ...state, isEtnaMobileApp: action.isEtnaMobileApp };
    default:
      return state;
  }
}
