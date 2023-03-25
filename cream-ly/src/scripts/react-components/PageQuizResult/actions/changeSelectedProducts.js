import { types } from "@Core/redux/quiz";
import * as Quiz from "@Core/app/quiz/change";

export default (selectedSKU) => (dispatch, getState) => {
  dispatch({
    type: types.ACTION_QUIZ_CHANGE_SELECTED_PRODUCTS,
    products: selectedSKU,
  });
  return Quiz.changeSelectedSKU(selectedSKU);
};
