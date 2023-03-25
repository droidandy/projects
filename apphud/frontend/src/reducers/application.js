import { handleActions } from "redux-actions"

import {
    fetchApplicationRequest,
    fetchApplicationSuccess,
    createApplicationSuccess,
    removeApplicationSuccess,
    updateApplicationSuccess,
    updateDashboardsSuccess,
    updateDashboardsRequest,
    updateConversionsDashboardRequest,
    updateConversionsDashboardSuccess
} from "../actions/application"

const initialState = {}

const application = handleActions(
  {
    [fetchApplicationRequest]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            loading: true
        }
    },
    [updateApplicationSuccess]: (state, action) => {
      return { ...action.payload }
    },
    [fetchApplicationSuccess]: (state, action) => {
      return {
          ...state,
          ...action.payload,
          loading: false
      }
    },
    [createApplicationSuccess]: (state, action) => {
      return { ...action.payload }
    },
    [removeApplicationSuccess]: (state, action) => {
      return { ...action.payload }
    },
    [updateDashboardsRequest]: (state, action) => {
        return {
            ...state,
            loading: true
        }
    },
    [updateDashboardsSuccess]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            loading: false
        }
    },
    [updateConversionsDashboardRequest]: (state, action) => {
        return {
            ...state,
            loading: true
        }
    },
    [updateConversionsDashboardSuccess]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            loading: false
        }
    }
  },
  initialState
)

export default application
