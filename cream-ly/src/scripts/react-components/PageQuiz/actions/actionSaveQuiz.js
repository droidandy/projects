import { goToQuizOrResults } from "@Core/app/router";
import * as Quiz from "@Core/app/quiz/change";

export default ({ skinType, skinGoals }) => {
  const attributes = {
    skinType,
    skinCareGoals: skinGoals,
    selectedSKU: [],
  };

  return Quiz.setNewQuizAnswers(skinType, skinGoals).then(() => {
    goToQuizOrResults(skinType, skinGoals);
  });
};
