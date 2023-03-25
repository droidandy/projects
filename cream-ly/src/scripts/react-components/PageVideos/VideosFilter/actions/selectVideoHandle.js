import { types } from ".";

export default handle => {
  return dispatch => {
    dispatch({ type: types.ACTION_SELECT_VIDEO_HANDLE, handle });
  };
};
