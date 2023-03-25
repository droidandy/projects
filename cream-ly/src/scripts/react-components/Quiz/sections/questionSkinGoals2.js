import React from "react";
import "./questionSkinGoals2.scss";
import QuizQuesiton from "./question";

const i18 = {
  en: {
    skinTypes: {
      edema: "Treat Edema",
      capillaries: "Treat broken capillaries",
      neck_wrinkles: "Treat neck wrinkles",
      breast_shape: "Improve breast shape",
      cellulite: "Treat cellulite"
    }
  },
  ru: {
    skinTypes: {
      edema: "Уменьшить отечность",
      capillaries: "Уменьшить купероз",
      neck_wrinkles: "Убрать кольца венеры",
      breast_shape: "Улучшить форму груди",
      cellulite: "Уменьшить целлюлит"
    }
  }
};

export default class QuizSkinGoals2 extends React.Component {
  constructor(props) {
    super(props);

    this.lang = this.props.lang ? this.props.lang : "ru";
    this.i18 = i18[this.lang];

    const options = [
      "edema",
      "capillaries",
      "neck_wrinkles",
      "breast_shape",
      "cellulite"
    ];

    this.state = {
      skinGoals: this.props.skinGoals
        ? this.props.skinGoals.filter(goal => options.includes(goal))
        : []
    };

    this.skinQuestionProps = {
      group: "skinGoals2",
      allowMultiSelect: true,
      overwriteClassName: "col-4 col-lg-2",
      options: options.map(goal => ({
        key: goal
      })),
      selected: this.state.skinGoals
    };
  }

  render() {
    this.skinQuestionProps.options = this.skinQuestionProps.options.map(
      option => ({
        ...option,
        name: this.i18.skinTypes[option.key],
        img: "goal_" + option.key + ".svg"
      })
    );

    return (
      <QuizQuesiton
        {...this.skinQuestionProps}
        onChange={this.props.onChange}
      />
    );
  }
}
