import { handleActions } from "redux-actions"

import { fetchTaxIdTypeSuccess, setAccountTimeZone, setDashboardPlatform } from "../actions/settings"

const localStorageName = "app_settings_timezone";
const localStoragePlatformName = "app_settings_platform";

const initialState = {
    tax_id_types: [],
    timezone: localStorage.getItem(localStorageName) || 0,
    platform: localStorage.getItem(localStoragePlatformName) || null,
}

const settings = handleActions(
  {
    [fetchTaxIdTypeSuccess]: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
    [setAccountTimeZone]: (state, action) => {
        localStorage.setItem(localStorageName, action.payload);
        return {
            ...state,
            timezone: action.payload
        }
    },
    [setDashboardPlatform]: (state, action) => {
      localStorage.setItem(localStoragePlatformName, action.payload);
      return {
        ...state,
        platform: action.payload,
      }
    }
  },
  initialState
)

export default settings
