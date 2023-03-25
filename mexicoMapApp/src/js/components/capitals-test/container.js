/**
 * Created by developercomputer on 11.01.16.
 */
import React, { Component } from "react";

import { f7, mainView } from "./../../f7init.js";

import Question from "./question.js";
import shuffle from "./../../utils/array-shufle.js";

import { words, LN } from "./../../words.js";

let audioWin, audioCorrect, audioIncorrect;

class CapitalsTest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      questionIndex: 0,
      correctAnswers: 0
    };
    this.startAgain = this.startAgain.bind(this);
    this.leaveTest = this.leaveTest.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
    this.wasAnswerWrong = false;
  }

  componentDidMount() {
    audioWin = document.getElementById("audio_win");
    audioCorrect = document.getElementById("audio_correct");
    audioIncorrect = document.getElementById("audio_incorrect");
  }

  startAgain() {
    this.setState({
      questionIndex: 0,
      correctAnswers: 0
    });
  }

  leaveTest() {
    mainView.router.back();
    this.setState({
      questionIndex: 0,
      correctAnswers: 0
    });
  }

  handleAnswer(isCorrect) {
    let { questionIndex, correctAnswers } = this.state;
    const { questions } = this.props;
    const quizLength = questions.length;
    isCorrect ? audioCorrect.play() : audioIncorrect.play();
    if(!isCorrect) {
      this.wasAnswerWrong = true;
      return;
    }
    if(!isCorrect && this.wasAnswerWrong) {
      return;
    }
    this.setState({
      correctAnswers: isCorrect && !this.wasAnswerWrong ? ++correctAnswers : correctAnswers
    });
    this.wasAnswerWrong = false;
    //test finished condition
    if(questionIndex + 2 > quizLength) {
      audioWin.play();
      return f7.modal({
        title: words.finish[LN],
        text: `${correctAnswers}/${quizLength}`,
        buttons: [
          {
            text: words.again[LN],
            bold: true,
            onClick: this.startAgain
          },
          {
            text: words.ok[LN],
            bold: true,
            onClick: this.leaveTest
          }
        ]
      });
    }
    return this.setState({
      questionIndex: questionIndex + 1
    });
  }

  _renderQuestion(questions) {
    const { questionIndex } = this.state;
    const question = questions[questionIndex];
    let shuffled = {...question, answers: shuffle(question.answers)};
    return (
        <Question {...shuffled} onClick={this.handleAnswer} />
    );
  }



  render() {
    const { questions } = this.props;
    return (
        <div className="wrapper">
          <div className="progressCounter forTest">
            <div className="progressCounter-text">
              {`${this.state.questionIndex + 1}/${questions.length}`}
            </div>
          </div>
          {this._renderQuestion(questions)}
        </div>
    );
  }
}

export default CapitalsTest;
