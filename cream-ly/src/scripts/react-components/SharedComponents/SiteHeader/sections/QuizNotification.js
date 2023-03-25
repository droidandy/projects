import React from "react";
import { translate } from "@Core/i18n";
import PageLink from "@Components/Structure/PageLink";


import "./QuizNotification.scss";

@translate({}, "common")
export default class QuizNotification extends React.Component {
  render() {
    return (
      <div className="quizNotification">
        <div className="content">
          {this.t("quizNotificaiton.ready") + " "}
          {/* <br className="d-block d-sm-none" /> */}
          <PageLink pageType="PAGE_QUIZ_OR_RESULTS">
            {this.t("quizNotificaiton.seeResults")}
          </PageLink>
        </div>
      </div>
    );
  }
}
