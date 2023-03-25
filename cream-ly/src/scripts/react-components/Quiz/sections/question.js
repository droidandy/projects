import React from "react";
import QuizOption from "./option";

export default class QuizQuestion extends React.Component {
  constructor(props) {
    super(props);

    if (!Array.isArray(props.options) || props.options.length == 0)
      throw Error(
        "no valid options provided. " + JSON.stringify(props.options)
      );

    this.options = props.options;

    this.state = {
      selectedOptions: props.selected ? props.selected : []
    };

    this.renderOption = this.renderOption.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(values, group) {
    if (typeof this.props.onChange === "function")
      this.props.onChange(values, group);
  }

  handleSelect(selectedValue) {
    let selectedOptions = Array.isArray(this.state.selectedOptions)
      ? this.state.selectedOptions
      : [];

    if (this.props.allowMultiSelect) selectedOptions.push(selectedValue);
    else selectedOptions = [selectedValue];

    this.setState({selectedOptions});

    if (typeof this.props.onSelect === "function")
      this.props.onSelect(this.props.group, selectedValue);

    this.handleOnChange(
      this.props.allowMultiSelect ? selectedOptions : selectedValue,
      this.props.group
    );
  }

  handleUnselect(unselectedValue) {
    if (!this.props.allowMultiSelect) return;

    const selectedOptions = this.state.selectedOptions.filter(
      option => option != unselectedValue
    );

    this.setState({selectedOptions});

    if (typeof this.props.onUnselect === "function")
      this.props.onUnselect(this.props.group, unselectedValue);

    this.handleOnChange(selectedOptions, this.props.group);
  }

  renderOption(option) {
    const className = this.props.overwriteClassName
      ? this.props.overwriteClassName
      : "col-6 col-md-3";
    return (
      <div key={option.key} className={"option " + className}>
        <QuizOption
          img={option.img}
          group={this.props.group}
          value={option.key}
          selected={
            Array.isArray(this.state.selectedOptions) &&
            this.state.selectedOptions.includes(option.key)
          }
          name={option.name}
          onClick={this.props.onClick}
          onSelect={this.handleSelect.bind(this)}
          onUnselect={this.handleUnselect.bind(this)}
        />
      </div>
    );
  }

  render() {
    return (
      <div
        data-group={this.props.group}
        className="componentQuizQuestion row no-gutters justify-content-center "
      >
        {this.options.map(this.renderOption)}
      </div>
    );
  }
}
