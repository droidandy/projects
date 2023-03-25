/**
 * Created by developercomputer on 11.01.16.
 */
import React, { Component } from "react";
import { words, LN } from "./../../words.js";
class Question extends Component {

  _renderAnswers() {
    const { answers, onClick } = this.props;
    return answers.map((item, i) => {
      return (
          <div
              key={i}
              onClick={() => {
                setTimeout(() => {
                  Object.keys(this.refs).map(key => this.refs[key].classList.remove("disable"));
                  this.refs[`answer${i}`].classList.remove("active");
                  onClick(item.isCorrect);
                }, 800);
                this.refs[`answer${i}`].classList.add("active");
                Object.keys(this.refs).map(key => this.refs[key].classList.add("disable"));
              }}
              className={`answer ${item.isCorrect}`} ref={`answer${i}`}>
            {item.content}
          </div>
      );
    });
  }

  render() {
    const { content } = this.props;
    return (
        <div className="questContainer">
          <div className="question">{words.makeQuest[LN](content)}</div>
          {this._renderAnswers()}
        </div>
    );
  }
}

export default Question;
