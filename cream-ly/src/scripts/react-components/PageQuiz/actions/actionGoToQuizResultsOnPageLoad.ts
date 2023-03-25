//@ts-nocheck
import { goToQuizOrResults } from "@Core/app/router";
import store from "@Core/redux";

export default ({ skinType, skinGoals }) => {
  const state: ReduxShape = store.getState();

  if (skinType && skinGoals && !state.app.route.params.redo)
    goToQuizOrResults(skinType, skinGoals);
};
