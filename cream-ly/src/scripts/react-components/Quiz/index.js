import React from "react";
import "./index.scss";

import Header from "@Components/Structure/Header";
import Button from "@Components/Structure/Button";
import QuizQ1 from "./sections/questionSkinType";
import QuizQ2 from "./sections/questionSkinGoals1";
import QuizQ3 from "./sections/questionSkinGoals2";
import Comment from "./sections/comment";
import { translate } from "@Core/i18n";

const i18 = {
  en: {
    header: "Let’s Create Your Skin Care Solution",
    header2: "What are your skin care goals?",
    button: "Get your treatmeant",
    question3: "Goals which we can treat with massage",
  },
  ru: {
    header: "ДАВАЙТЕ СОЗДАДИМ ВАШ ПЕРСОНАЛЬНЫЙ УХОД",
    header2: "Какие проблемы хотелось бы решить?",
    button: "Получить план ухода",
    question3: "Проблемы, которые можно решить с помощью массажа",
  },
};
@translate(
  {
    header: "ДАВАЙТЕ СОЗДАДИМ ВАШ ПЕРСОНАЛЬНЫЙ УХОД",
    header2: "Какие проблемы хотелось бы решить?",
    button: "Получить план ухода",
    question3: "Проблемы, которые можно решить с помощью массажа",
  },
  "Quiz"
)
export default class Quiz extends React.Component {
  constructor(props) {
    super(props);

    this.refSkinTypeQuestion = React.createRef();
    this.refSkinGoalsQuestion = React.createRef();

    this.assetURL = props.assetURL ? props.assetURL : "";

    this.state = {
      skinType: props.skinType ? props.skinType : null,
      skinGoals: props.skinGoals ? props.skinGoals : [],
      skinGoals1: [],
      skinGoals2: [],
      comment: props.comment ? props.comment : null,

      isButtonClicked: Boolean(props.isButtonClicked),
      isErrorNoSkinType: false,
      isErrorNoSkinGoals: false,
      isComplete: false,

      isScrollOff: Boolean(props.isScrollOff),
    };

    this.lang = this.props.lang ? this.props.lang : "ru";

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  getComment() {
    this.setState({
      comment: document.querySelector(".componentQuizComment textarea").value,
    });
  }

  scrollToError() {
    if (this.state.isScrollOff) return;

    if (this.state.isErrorNoSkinType) {
      this.refSkinTypeQuestion.current.scrollIntoView({ behavior: "smooth" });
    } else if (this.state.isErrorNoSkinGoals) {
      this.refSkinGoalsQuestion.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  checkForErrors() {
    if (!this.state.isButtonClicked) return;

    const isErrorNoSkinType = !this.state.skinType;
    const isErrorNoSkinGoals = this.state.skinGoals.length == 0;

    this.setState(
      { isErrorNoSkinType, isErrorNoSkinGoals },
      this.scrollToError
    );

    return isErrorNoSkinType || isErrorNoSkinGoals;
  }

  handleButtonClick() {
    this.setState(
      {
        isButtonClicked: true,
      },
      () => {
        const isError = this.checkForErrors();

        if (isError) {
          if (typeof this.props.onError === "function")
            this.props.onError(this.state);
          return;
        }

        if (typeof this.props.onComplete === "function") {
          this.props.onComplete(this.state);
          this.setState({ isComplete: true });
        }
      }
    );
  }

  skinGoalsMerge(updatedGoals, group) {
    const goalsToMerge =
      group === "skinGoals1" ? this.state.skinGoals2 : this.state.skinGoals1;

    const mergedGoals = [...new Set(goalsToMerge.concat(updatedGoals))];

    this.setState({
      skinGoals: mergedGoals,
    });

    if (group === "skinGoals1") this.setState({ skinGoals1: updatedGoals });
    if (group === "skinGoals2") this.setState({ skinGoals2: updatedGoals });
  }

  handleChange(value, group) {
    if (group === "skinType") this.setState({ skinType: value });
    if (group === "comment") this.setState({ comment: value });
    if (group === "skinGoals1" || group === "skinGoals2")
      this.skinGoalsMerge(value, group);

    if (typeof this.props.onChange === "function")
      this.props.onChange(value, group);
  }

  componentDidUpdate(prevProp, prevState) {
    if (
      this.state.skinGoals != prevState.skinGoals ||
      this.state.skinType != prevState.skinType
    )
      this.checkForErrors();
  }

  componentDidMount() {
    if (typeof this.props.onLoad === "function") this.props.onLoad(this.state);
    if (this.state.isButtonClicked) this.checkForErrors();
  }

  render() {
    return (
      <div className="componentQuiz text-center">
        <Header text={this.i18n.header} />
        <div ref={this.refSkinTypeQuestion} />
        <QuizQ1
          lang={this.props.lang}
          assetURL={this.props.assetURL}
          skinType={this.props.skinType}
          onChange={this.handleChange.bind(this)}
          isError={this.state.isButtonClicked && this.state.isErrorNoSkinType}
        />
        <div ref={this.refSkinGoalsQuestion} />
        <Header text={this.i18n.header2} />
        <QuizQ2
          isError={this.state.isButtonClicked && this.state.isErrorNoSkinGoals}
          assetURL={this.props.assetURL}
          lang={this.props.lang}
          skinGoals={this.props.skinGoals}
          onChange={this.handleChange.bind(this)}
        />
        {!this.props.isModal && (
          <section>
            <div className="questionText">{this.t("question3")}</div>
            <QuizQ3
              lang={this.props.lang}
              assetURL={this.props.assetURL}
              skinGoals={this.props.skinGoals}
              onChange={this.handleChange.bind(this)}
            />
          </section>
        )}
        {!this.props.isModal && (
          <Comment
            lang={this.props.lang}
            isDisabled={this.state.isComplete}
            comment={this.props.comment}
            onChange={this.handleChange.bind(this)}
          />
        )}

        <Button
          text={this.i18n.button}
          isLoading={this.state.isComplete}
          extra={{ "data-test": "linkRecommendations" }}
          onClick={this.handleButtonClick}
        />
      </div>
    );
  }
}
