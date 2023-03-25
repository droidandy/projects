import Constants from "../constants";

import { size } from "../../components/styles";

const Actions = {
  setDevice: innerWidth => {
    return dispatch => {
      if (innerWidth < size.laptop) {
        dispatch({
          type: Constants.SET_MOBILE_DEVICE
        });
      } else {
        dispatch({
          type: Constants.SET_DESKTOP_DEVICE
        });
      }
    };
  },

  showNotification: (text, type) => {
    return dispatch => {
      dispatch({
        type: Constants.SHOW_NOTIFICATION,
        notificationText: text,
        notificationType: type
      });

      setTimeout(() => {
        dispatch({
          type: Constants.HIDE_NOTIFICATION
        });
      }, 3000);
    };
  },

  hideNotification: (text, type) => {
    return function(dispatch) {
      dispatch({
        type: Constants.HIDE_NOTIFICATION
      });
    };
  },

  acceptCookies: () => {
    return dispatch => {
      dispatch({
        type: Constants.ACCEPT_COOKIES
      });
    };
  },

  rejectCookies: () => {
    return dispatch => {
      dispatch({
        type: Constants.REJECT_COOKIES
      });
    };
  },

  toggleIsPro: () => {
    return function(dispatch) {
      dispatch({
        type: Constants.TOGGLE_IS_PRO
      })
    }
  }
};

export default Actions;
