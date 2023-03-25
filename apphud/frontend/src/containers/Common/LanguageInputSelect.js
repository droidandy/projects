import React, { Component } from "react"
import { connect } from "react-redux"
import Select, { components } from "react-select"

const { Option, SingleValue } = components

const IconOption = (props) => {
  return (
    <Option {...props}>
      <img src={props.data.icon} alt="Language icon" />
      {props.selectProps.getOptionLabel(props.data)}
    </Option>
  )
}

const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 7L8 3L12 7H4Z" fill="#0085FF" />
          <path d="M4 9L8 13L12 9H4Z" fill="#0085FF" />
        </svg>
      </components.DropdownIndicator>
    )
  )
}

const ValueOption = (props) => (
  <SingleValue {...props}>
    <img src={props.data.icon} alt="Language icon" />
    {props.selectProps.getOptionLabel(props.data)}
  </SingleValue>
)

class LanguageInputSelect extends Component {
  render() {
    return (
      <Select
        components={{
          IndicatorSeparator: () => null,
          Option: IconOption,
          SingleValue: ValueOption,
          DropdownIndicator
        }}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageInputSelect)
