import React, { Component } from "react"
import { connect } from "react-redux"
import Select, { components } from "react-select"

const { Option } = components
const IconOption = (props) => {
  return (
    <Option {...props}>
      {props.selectProps.getOptionLabel(props.data)}
      {props.isSelected && (
        <svg
          className="input-select__option-icon"
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 4L5.5 8.5L13 1" stroke="#0085FF" strokeWidth="2" />
        </svg>
      )}
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

class InputSelect extends Component {
  render() {
    return (
      <Select
        components={{
          IndicatorSeparator: () => null,
          Option: IconOption,
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

export default connect(mapStateToProps, mapDispatchToProps)(InputSelect)
