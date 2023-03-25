import React from "react";

import QuizQuesiton from "./question";
import QuizError from "@Components/Structure/Error";

const i18 = {
  en: {
    question: "What are your skin care goals?",
    error: "At least one skin care goal has to be selected",
    skinTypes: {
      wrinkles: "Treat Wrinkles",
      acne: "Treat Acne",
      sensitive: "Treat Sensitive Skin",
      dehydrated: "Treat Dehydrated Skin",
      pimple: "Treat pimple here and there",
      lighten: "Lighten acne scars or pigmentation",

      body: "Treat body skin",
    },
  },
  ru: {
    question: "Проблемы, которые можно решить с помощью уходовых средств",
    error: "Как минимум одна цель должна быть выбрана",
    skinTypes: {
      wrinkles: "Уменьшить морщинки",
      acne: "Уменьшить акне",
      sensitive: "Уход за чувствительной кожей",
      dehydrated: "Уход за обезвоженной кожей",
      pimple: "Уменьшить небольшое акне (например, перед менструацией)",
      lighten: "Осветлить следы от пигментации или акне",
      body: "Увлажнение кожи тела",
    },
  },
};

export default class QuizSkinGoals1 extends React.Component {
  constructor(props) {
    super(props);

    this.lang = this.props.lang ? this.props.lang : "ru";
    this.i18 = i18[this.lang];

    const options = [
      "wrinkles",
      "acne",
      "sensitive",
      "dehydrated",
      "pimple",
      "lighten",
      "body",
    ];

    this.state = {
      skinGoals: this.props.skinGoals
        ? this.props.skinGoals.filter((goal) => options.includes(goal))
        : [],
    };

    this.skinQuestionProps = {
      group: "skinGoals1",
      allowMultiSelect: true,
      options: options.map((goal) => ({
        key: goal,
      })),
      selected: this.state.skinGoals,
    };

    this.state = {
      skinGoals: this.props.skinGoals
        ? this.props.skinGoals.filter((goal) => {
            return this.skinQuestionProps.options.includes({ key: goal });
          })
        : null,
    };
  }

  render() {
    this.skinQuestionProps.options = this.skinQuestionProps.options.map(
      (option) => ({
        ...option,
        name: this.i18.skinTypes[option.key],
        img: "goal_" + option.key + ".svg",
      })
    );

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
