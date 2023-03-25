import React, { Component } from "react"
import { connect } from "react-redux"
import { uuidv4 } from "../../libs/helpers"
import Tip from "./Tip"
import classNames from "classnames"

class InputRadio extends Component {
  id = uuidv4();

  inputClassNames = (disabled) => {
    return classNames("radio", {
      radio_disabled: disabled
    })
  };

  labelClassNames = (disabled) => {
    return classNames("radio-label radio-label_tip", {
      radio_disabled: disabled
    })
  };

  render() {
    const {
      label,
      value,
      checked,
      onChange,
      useTip,
      tipOptions,
      disabled
    } = this.props
    return (
      <div className="radio-wrapper">
        <input
          disabled={disabled}
          checked={checked}
          id={this.id}
          type="radio"
          value={value}
          className={this.inputClassNames(disabled)}
          onChange={onChange}
        />
        <label htmlFor={this.id} className={this.labelClassNames(disabled)}>
          <span className="label-text">{label}</span>
        </label>
        {useTip && (
          <Tip
            title={tipOptions.title}
            description={tipOptions.description}
            buttonUrl={tipOptions.url}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(InputRadio)
