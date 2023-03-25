import React from "react";
import "./questions.scss";
import QuizQuesiton from "../../PageQuiz/sections/question";

const skinTypes = [
  "wrinkles",
  "edema",
  "capillaries",
  "neck_wrinkles",
  "breast_shape",
  "cellulite"
];

const includes = goal => skinTypes.includes(goal);
const mapper = option => ({ key: option });

const VideosFilterQuestions = ({ skinGoals = [], onChange }) => (
  <QuizQuesiton
    allowMultiSelect
    group="videoGoals"
    overwriteClassName="col-4 col-lg-2"
    options={skinTypes.map(mapper)}
    selected={skinGoals.filter(includes)}
    onChange={onChange}
  />
);

export default VideosFilterQuestions;
