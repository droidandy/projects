import React from "react";
import "./comment.scss";

const i18 = {
  en: {
    question:
      "Please let us know if there is anything extra we need to know about your skin",
    placeholder: "Anything else to share?"
  },
  ru: {
    question:
      "Есть ли что-то еще, что мы должны знать о вашей коже (например, аллергия, непереносимость, как проявляется чувствительность, если кожа чувствительна и т.д.)",
    placeholder: "Расскажите"
  }
};
export default class QuizComment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: this.props.comment ? this.props.comment : null
    };

    this.lang = this.props.lang ? this.props.lang : "ru";
    this.i18 = i18[this.lang];
  }

  handleChange(event) {
    if (typeof this.props.onChange === "function")
      this.props.onChange(event.target.value, "comment");
  }

  render() {
    return (
      <section className="componentQuizComment">
        <div className="questionText">{this.i18.question}</div>
        <textarea
          disabled={this.props.isDisabled}
          placeholder={this.i18.placeholder}
          defaultValue={this.props.comment}
          onBlur={this.handleChange.bind(this)}
        ></textarea>
      </section>
    );
  }
}
