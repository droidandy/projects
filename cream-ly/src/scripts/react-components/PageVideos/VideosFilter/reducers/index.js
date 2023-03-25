import show_video_results from "./show_video_results";
import { types } from "../actions";
import uniq from 'lodash/uniq';

const initialState = {
  isButtonResultsClicked: false,
  isButtonAddToCartClicked: false,
  selectedGoals: [],
  videosHandles: [],
  videosHandlesSelectedByUser: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ACTION_CHANGE_GOALS:
      return {
        ...state,
        selectedGoals: action.goals,
        videosHandles: uniq(show_video_results(action.goals)),
        videosHandlesSelectedByUser: uniq(show_video_results(action.goals)),
      };
    case types.ACTION_SELECT_VIDEO_HANDLE: {
      const isVideoHandleExist = state.videosHandlesSelectedByUser.includes(
        action.handle
      );

      const videosHandlesSelectedByUser = isVideoHandleExist
        ? state.videosHandlesSelectedByUser.filter(
            item => item !== action.handle
          )
        : [...state.videosHandlesSelectedByUser, action.handle];
      return {
        ...state,
        videosHandlesSelectedByUser,
      };
    }
    case types.ACTION_CLICK_SHOW_RESULT:
      return {
        ...state,
        isButtonResultsClicked: true,
        videosHandles: show_video_results(state.selectedGoals),
      };
    case types.ACTION_CLICK_ADD_TO_CART:
      return {
        ...state,
        isButtonAddToCartClicked: true,
        isRequestComplete: false,
      };
    case types.ADD_TO_CART_COMPLETE:
      return {
        ...state,
        isRequestComplete: true,
        isRequestError: false,
      };
    case types.ADD_TO_CART_ERROR:
      return {
        ...state,
        isRequestComplete: true,
        isRequestError: true,
      };
    default:
      return state;
  }
};
