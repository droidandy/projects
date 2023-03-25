import { types } from ".";
import * as Quiz from "@Core/app/quiz/change";

export default (goals) => {
  return (dispatch) => {
    dispatch({ type: types.ACTION_CHANGE_GOALS, goals });
    return Quiz.changeVideoGoals(goals);
  };
};
