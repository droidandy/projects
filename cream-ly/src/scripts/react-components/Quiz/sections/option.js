import React from "react";
import "./option.scss";

export default class QuizOption extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    const toggle = !this.props.selected;
    if (typeof this.props.onClick === "function")
      this.props.onClick(this.props.value, this.props.group, toggle);
    if (toggle && typeof this.props.onSelect === "function")
      this.props.onSelect(this.props.value, this.props.group);
    if (!toggle && typeof this.props.onUnselect === "function")
      this.props.onUnselect(this.props.value, this.props.group);
  }
  render() {
    return (
      <div
        className="componentQuizOption"
        data-selected={this.props.selected}
        data-is-problem={this.props.isProblem}
        data-option-group={this.props.group}
        data-option-value={this.props.value}
        onClick={this.handleClick.bind(this)}
      >
        <div className="bubble row">
          <div className="img align-self-center"></div>
        </div>
        <div className="label">{this.props.name}</div>
      </div>
    );
  }
}
