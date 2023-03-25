import React, { Component } from "react";
import PageLink from "@Components/Structure/PageLink";
import Button from "@Components/Structure/Button";

import { translate } from "@Core/i18n";
import "./index.scss";

import Step2 from "./step2.svg";
import Step3 from "./step3.svg";

@translate(
  {
    title: "НАТУРАЛЬНАЯ КОСМЕТИКА CREAM.LY",
    subtitle: `Ваша кожа может и хочет функционировать правильно самостоятельно.<br />Мы лишь немного ей поможем`,
    stepOneText: "Выберите тип кожи и цели по уходу",
    stepTwoText: "Получите свою персональную рекомендацию",
    stepThreeText: "Закажите средства по уходу",
    buttonText: "ПОЛУЧИТЬ ПЛАН УХОДА",
    buttonResultText: "ПОСМОТРЕТЬ ваши рекомендации",
  },
  "HomePromoMain"
)
export default class HomePromoMain extends Component {
  loadCSS(variant) {
    if (variant === "newyear2020v1")
      return React.lazy(() => import("./variants/newyear2020v1"));

    if (variant === "newyear2020v2")
      return React.lazy(() => import("./variants/newyear2020v2"));

    if (variant === "variant2021feb")
      return React.lazy(() => import("./variants/variant2021feb"));

    if (variant === "newyear2022")
      return React.lazy(() => import("./variants/newyear2022"));

    if (variant === "variant2022jan")
      return React.lazy(() => import("./variants/variant2022jan"));

    return React.lazy(() => import("./variants/default"));
  }

  render() {
    const variant = this.props.variant ? this.props.variant : "default";
    const CSS = this.loadCSS(variant);

    return (
      <div className={`HomePromoMain ${variant}`}>
        <React.Suspense fallback={<></>}>
          <CSS />
        </React.Suspense>
        <div className={`container container--${this.props.lang}`}>
          <div className={`content content--${this.props.lang}`}>
            <div className="title">
              <h1>{this.t("title")}</h1>
              <div
                className="subtitle"
                dangerouslySetInnerHTML={{ __html: this.t("subtitle") }}
              />
            </div>

            <div className="steps row">
              <div className="item col-sm-4 ">
                <div className="step_img">
                  <div className="step1_img" />
                </div>
                <div className="number">1</div>
                <p>{this.t("stepOneText")}</p>
              </div>
              <div className="item col-sm-4 step2">
                <div className="step_img">
                  <Step2 />
                </div>
                <div className="number">2</div>
                <p>{this.t("stepTwoText")}</p>
              </div>
              <div className="item col-sm-4 step3">
                <div className="step_img">
                  <Step3 />
                </div>
                <div className="number">3</div>
                <p>{this.t("stepThreeText")}</p>
              </div>
            </div>

            <div className="buttonArea">
              <PageLink
                dataTest={
                  this.props.isQuizReady ? "linkQuizResults" : "linkQuiz"
                }
                pageType={"PAGE_QUIZ_OR_RESULTS"}
              >
                <Button
                  green={Boolean(this.props.isQuizReady)}
                  rose={!Boolean(this.props.isQuizReady)}
                >
                  {this.t(
                    this.props.isQuizReady ? "buttonResultText" : "buttonText"
                  )}
                </Button>
              </PageLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
