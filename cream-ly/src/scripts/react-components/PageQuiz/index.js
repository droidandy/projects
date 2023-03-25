import React from "react";
import { connect } from "@Components/index";
import "./index.scss";

import Header from "@Components/Structure/Header";
import SubmitButton from "@Components/Structure/Button";
import QuizError from "@Components/Structure/Error";
import QuestionSkinType from "./sections/questionSkinType";
import QuestionSkinGoals from "./sections/questionGoals";
import { translate } from "@Core/i18n";

import actionGoToQuizResultsOnPageLoad from "./actions/actionGoToQuizResultsOnPageLoad";
import actionSaveQuiz from "./actions/actionSaveQuiz";

@translate({}, "PageQuiz")
class PageQuiz extends React.Component {
  constructor(props) {
    super(props);

    this.refSkinTypeQuestion = React.createRef();
    this.refSkinGoalsQuestion = React.createRef();

    this.assetURL = props.assetURL ? props.assetURL : "";

    this.state = {
      skinType: props.skinType ? props.skinType : null,
      skinGoals: props.skinGoals ? props.skinGoals : [],
      isButtonClicked: Boolean(props.isButtonClicked),
      isErrorNoSkinType: false,
      isErrorNoSkinGoals: false,
      isComplete: false,

      isScrollOff: Boolean(props.isScrollOff),
    };

    if (typeof this.props.actionGoToQuizResultsOnPageLoad === "function")
      this.props.actionGoToQuizResultsOnPageLoad({
        skinGoals: this.state.skinGoals,
        skinType: this.state.skinType,
      });

    this.handleButtonClick = this.handleButtonClick.bind(this);
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

        if (typeof this.props.actionSaveQuiz === "function") {
          this.props.actionSaveQuiz({
            skinGoals: this.state.skinGoals,
            skinType: this.state.skinType,
          });
          this.setState({ isComplete: true });
        }
      }
    );
  }

  handleChange(newValue, group) {
    this.setState({
      [group]: newValue,
    });

    if (typeof this.props.onChange === "function")
      this.props.onChange(JSON.stringify(newValue), group);
  }

  componentDidUpdate(prevProp, prevState) {
    if (
      this.state.skinGoals != prevState.skinGoals ||
      this.state.skinType != prevState.skinType
    )
      this.checkForErrors();
  }

  componentDidMount() {
    if (this.state.isButtonClicked) this.checkForErrors();
  }

  render() {
    return (
      <div className="componentQuiz text-center">
        <Header isPageHeader text={this.t("header")} />
        <div ref={this.refSkinTypeQuestion} />
        <QuestionSkinType
          lang={this.props.lang}
          assetURL={this.props.assetURL}
          skinType={this.props.skinType}
          onChange={(newSkinType) => this.handleChange(newSkinType, "skinType")}
          isError={this.state.isButtonClicked && this.state.isErrorNoSkinType}
        />
        <div ref={this.refSkinGoalsQuestion} />
        <Header text={this.t("header2")} />
        {this.state.isButtonClicked && this.state.isErrorNoSkinGoals && (
          <QuizError text={this.t("errorGoals")} />
        )}
        <QuestionSkinGoals
          lang={this.props.lang}
          allSelectedGoals={this.state.skinGoals}
          onChange={(newGoals) => this.handleChange(newGoals, "skinGoals")}
        />
        <SubmitButton
          text={this.t("button")}
          isLoading={this.state.isComplete}
          extra={{ "data-test": "linkRecommendations" }}
          onClick={this.handleButtonClick}
        />
      </div>
    );
  }
}

PageQuiz.defaultProps = {
  actionGoToQuizResultsOnPageLoad,
  actionSaveQuiz,
};

const mapStateToProps = (state, ownProps) => {
  return {
    fulfillmentCode: ownProps.fulfillmentCode
      ? ownProps.fulfillmentCode
      : state.app.localizationSettings.fulfillmentCode,
    skinType: ownProps.skinType ? ownProps.skinType : state.quiz.skinType,
    skinGoals: ownProps.skinGoals
      ? ownProps.skinGoals
      : state.quiz.skinCareGoals,
  };
};

export default connect(mapStateToProps, null)(PageQuiz);
