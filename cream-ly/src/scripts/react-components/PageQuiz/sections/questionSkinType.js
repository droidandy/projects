import React from "react";

import QuizQuesiton from "./question";
import QuizError from "@Components/Structure/Error";
import { getAllowedOptions } from "@Core/quiz/configuration";
import { translate } from "@Core/i18n";

@translate(
  {
    question1: "Выберите тип жирности вашей кожи лица",
    errorSkinType: "Нужно выбрать тип кожи",
    skinTypes: {
      normal: "Нормальная",
      dry: "Сухая",
      oily: "Жирная",
      mixed: "Смешанная",
    },
  },
  "PageQuiz"
)
export default class QuizQuestionSkinType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skinType: this.props.skinType ? this.props.skinType : null,
    };

    this.skinQuestionProps = {
      group: "skinType",
      options: getAllowedOptions("skinType").map((skinType) => ({
        key: skinType,
        name: this.t("skinTypes." + skinType),
      })),
      selected: [this.state.skinType],
    };
  }

  render() {
    return (
      <section>
        <div className="questionText">{this.t("question1")}</div>
        {this.props.isError && <QuizError text={this.t("errorSkinType")} />}
        <QuizQuesiton
          {...this.skinQuestionProps}
          onChange={this.props.onChange}
        />
      </section>
    );
  }
}
