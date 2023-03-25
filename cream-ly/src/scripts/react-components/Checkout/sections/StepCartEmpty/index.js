import React from "react";
import Button from "@Components/Structure/Button";
import "./index.scss";
import { translate } from "@Core/i18n";
import * as Router from "@Core/app/router";

@translate(
  {
    empty: {
      title: "Эх, я пустая корзина и мне очень одиноко :(",
      intro:
        "Но если вы заполните квиз - я обещаю развеселиться в компании отличных натуральных уходовых средств",
      buttonQuiz: "Начать Квиз",
    },
  },
  "PageCheckout"
)
export default class CartEmpty extends React.Component {
  render() {
    return (
      <div className="componentCheckoutCartEmpty mt-5 text-center">
        <div className="text">{this.t("empty.title")}</div>
        <div
          className="text"
          style={{ maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }}
        >
          {this.t("empty.intro")}
        </div>
        <Button
          green
          pageType={"PAGE_QUIZ_OR_RESULTS"}
          text={this.t("empty.buttonQuiz")}
        />

        <div className="img" />
      </div>
    );
  }
}
