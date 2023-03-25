import React from "react";

import "./SelectedOptions.scss";
import { translate } from "@Core/i18n/";
import QuizOption from "../../PageQuiz/sections/option";
import PageLink from "@Components/Structure/PageLink";

@translate(
  {
    skin: "кожа",
    commentLabel: "",
    buttonBackToQuiz: "Нажмите сюда",
  },
  "PageQuizResult"
)
class SelectedOptions extends React.Component {
  render() {
    return (
      <div className="componentSelectedOptions">
        <div className="personal-treatment__list d-flex ">
          <div className="row justify-content-center mx-auto">
            <div className="componentQuizItem">
              <QuizOption value={this.props.skinType} selected />
              <div className="title">
                {this.t("PageQuiz:skinTypes." + this.props.skinType)}{" "}
                {this.t("skin")}
              </div>
            </div>
            {Array.isArray(this.props.goals) &&
              this.props.goals.map((goal) => (
                <div key={goal} className="componentQuizItem">
                  <QuizOption value={goal} group={"goals"} selected />
                  <div className="title">
                    {this.t("PageQuiz:goals." + goal)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="skin-care--hint text-center">
          <PageLink pageType="PAGE_QUIZ" redo="1">
            {this.t("buttonBackToQuiz")}
          </PageLink>
        </div>
      </div>
    );
  }
}

export default SelectedOptions;
