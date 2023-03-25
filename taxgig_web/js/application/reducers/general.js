import Constants from "../constants";

const initialState = {
  isMobile: false,
  acceptCookies: true,
  isPro: false,
  showNotification: false, 
  
  // Possible Types: default || error
  notificationType: "default", // TODO: Change to "",
  notificationText: "Some notification" // TODO: Change to ""
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SET_MOBILE_DEVICE:
      return {
        ...state,
        isMobile: true,
      };

    case Constants.SET_DESKTOP_DEVICE:
      return {
        ...state,
        isMobile: false,
      };

    case Constants.SHOW_NOTIFICATION:
      return {
        ...state,
        showNotification: true,
        notificationType: action.notificationType,
        notificationText: action.notificationText
      };

    case Constants.HIDE_NOTIFICATION:
      return {
        ...state,
        showNotification: false,
      };

    case Constants.ACCEPT_COOKIES:
      return {
        ...state,
        acceptCookies: true,
      };

    case Constants.REJECT_COOKIES:
      return {
        ...state,
        acceptCookies: false,
      };

    case Constants.TOGGLE_IS_PRO:
      return {
        ...state,
        isPro: !state.isPro,
      };


    default:
      return state;
  }
}
