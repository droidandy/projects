import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"

class Input extends Component {
  t = new Date().getTime();

  classNames = () => {
    return classNames("input input_blue input_stretch", {
      input_error: this.props.invalid
    })
  };

  render() {
    return (
      <div className="input-wrapper ta-left">
        <label className="l-p__label" htmlFor={this.t + "label"}>
          {this.props.label}
        </label>
        <div className="input-wrapper__required">
          <input
            id={this.t + "label"}
            type="text"
            className={this.classNames()}
            {...this.props}
          />
          <span className="required-label">Required</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Input)
