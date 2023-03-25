import React from "react";
import "./comment.scss";
import { translate } from "@Core/i18n";

@translate(
  {
    question4comment:
      "Есть ли что-то еще, что мы должны знать о вашей коже (например, аллергия, непереносимость, как проявляется чувствительность, если кожа чувствительна и т.д.)",
    placeholderComment: "Расскажите",
  },
  "PageQuiz"
)
export default class QuizComment extends React.Component {
  handleChange(event) {
    if (typeof this.props.onChange === "function")
      this.props.onChange(event.target.value, "comment");
  }

  render() {
    return (
      <section className="componentQuizComment">
        <div className="questionText">{this.t("question4comment")}</div>
        <textarea
          disabled={this.props.isDisabled}
          placeholder={this.t("placeholderComment")}
          defaultValue={this.props.comment}
          onBlur={this.handleChange.bind(this)}
        ></textarea>
      </section>
    );
  }
}
