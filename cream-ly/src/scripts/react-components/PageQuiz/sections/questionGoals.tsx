import React from "react";

import Header from "@Components/Structure/Header";
import OptionsSelector from "./question";
import { useTranslate } from "@Core/i18n";
import { connect } from "@Components/index";
import { getAllowedOptions } from "@Core/quiz/configuration";

interface IQuestionGoalsProps {
  lang: string;
  fulfillmentCode: string;
  allSelectedGoals: string[];
  onChange: {
    (newGoals: string[]): void;
  };
}

const QuestionGoals = ({
  lang,
  allSelectedGoals,
  fulfillmentCode,
  onChange,
}: IQuestionGoalsProps) => {
  const t = useTranslate("PageQuiz", lang);

  const selectedGoals: any = {};
  selectedGoals.skinGoals = filterSelectedGoalsByGroup(
    allSelectedGoals,
    "skinGoals",
    fulfillmentCode
  );
  selectedGoals.bodyGoals = filterSelectedGoalsByGroup(
    allSelectedGoals,
    "bodyGoals",
    fulfillmentCode
  );

  const onGoalsChange = (changedGoals, group) => {
    const newGoals = { ...selectedGoals, [group]: changedGoals };
    const merged = newGoals.skinGoals.concat(newGoals.bodyGoals);
    onChange(merged);
  };

  return (
    <section className="goals">
      {/* <div className="questionText">{t("question2")}</div> */}
      <OptionsSelector
        group={"skinGoals"}
        allowMultiSelect={true}
        options={getOptions("skinGoals", fulfillmentCode)}
        selected={selectedGoals.skinGoals}
        lang={lang}
        onChange={onGoalsChange}
      />
      <Header text={t("questionBody")} />
      <OptionsSelector
        group={"bodyGoals"}
        allowMultiSelect={true}
        options={getOptions("bodyGoals", fulfillmentCode)}
        selected={selectedGoals.bodyGoals}
        lang={lang}
        onChange={onGoalsChange}
      />
    </section>
  );
};

const filterSelectedGoalsByGroup = (
  allSelectedGoals: string[],
  group: "bodyGoals" | "skinGoals",
  fulfillmentCode: string
) => {
  const allowedGoals = getAllowedOptions(group, fulfillmentCode);
  return allSelectedGoals.filter((selectedGoal) =>
    allowedGoals.includes(selectedGoal)
  );
};

export const getOptions = (
  group: "bodyGoals" | "skinGoals",
  fulfillmentCode: string
) => {
  return getAllowedOptions(group, fulfillmentCode).map((goal) => ({
    key: goal,
  }));
};

const mapStateToProps = (state, ownProps) => {
  return {
    fulfillmentCode: ownProps.fulfillmentCode
      ? ownProps.fulfillmentCode
      : state.app.localizationSettings.fulfillmentCode,
  };
};

export default connect(mapStateToProps)(QuestionGoals);
