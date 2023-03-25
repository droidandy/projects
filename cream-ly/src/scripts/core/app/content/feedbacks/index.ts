//@ts-nocheck
import { getTranslation } from "@Core/i18n/";

export default (lang = "ru") => {
  const stringFeedback = getTranslation({
    key: "feedbacks",
    namespace: "PageQuizResult",
    lang,
  });

  const feedbacks = stringFeedback.includes("[")
    ? stringFeedback
        .replace("[", "")
        .replace("]", "")
        .split('",')
        .map((item) => item.replace('"', "").trim())
        .filter((item) => !!item.length)
    : [];

  return feedbacks;
};
