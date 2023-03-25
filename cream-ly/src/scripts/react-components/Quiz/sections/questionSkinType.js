import React from "react";

import QuizQuesiton from "./question";
import QuizError from "@Components/Structure/Error";

const i18 = {
  en: {
    question: "What is your skin type?",
    error: "Skin type has to be selected",
    skinTypes: {
      normal: "Normal",
      dry: "Dry",
      oily: "Oily",
      mixed: "Mixed",
    },
  },
  ru: {
    question: "Выберите тип жирности вашей кожи лица",
    error: "Нужно выбрать тип кожи",
    skinTypes: {
      normal: "Нормальная",
      dry: "Сухая",
      oily: "Жирная",
      mixed: "Смешанная",
    },
  },
};
export default class QuizQuestionSkinType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skinType: this.props.skinType ? this.props.skinType : null,
    };

    this.lang = this.props.lang ? this.props.lang : "ru";
    this.i18 = i18[this.lang];

    this.skinQuestionProps = {
      group: "skinType",
      options: [
        { key: "normal" },
        { key: "dry" },
        { key: "oily" },
        { key: "mixed" },
      ].map((option) => ({
        ...option,
        name: this.i18.skinTypes[option.key],
        img: "skintype_" + option.key + ".svg",
      })),
      selected: [this.state.skinType],
    };
  }

  render() {
    return (
      <section>
        <div className="questionText">{this.i18.question}</div>
        {this.props.isError && <QuizError text={this.i18.error} />}
        <QuizQuesiton
          {...this.skinQuestionProps}
          onChange={this.props.onChange}
        />
      </section>
    );
  }
}
