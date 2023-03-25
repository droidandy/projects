import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"

class TextStyle extends Component {
  handleBold = () => {
    const type = this.props.value.fontWeight === "bold" ? "normal" : "bold"
    this.update({ fontWeight: type })
  };

  handleItalic = () => {
    const type = this.props.value.fontStyle === "italic" ? "normal" : "italic"
    this.update({ fontStyle: type })
  };

  handleUnderline = () => {
    const type =
      this.props.value.textDecoration === "underline" ? "none" : "underline"
    this.update({ textDecoration: type })
  };

  handleLineThrough = () => {
    const type =
      this.props.value.textDecoration === "line-through"
        ? "none"
        : "line-through"
    this.update({ textDecoration: type })
  };

  update = (hash) => {
    const newValue = Object.assign({}, this.props.value, hash)
    this.props.onChange(newValue)
  };

  render() {
    const { value } = this.props
    const boldClasses = classNames("ps-text__style-controls__button", {
      "ps-text__style-controls__button_active": value.fontWeight === "bold"
    })
    const italicClasses = classNames("ps-text__style-controls__button", {
      "ps-text__style-controls__button_active": value.fontStyle === "italic"
    })
    const underlineClasses = classNames("ps-text__style-controls__button", {
      "ps-text__style-controls__button_active":
        value.textDecoration === "underline"
    })
    const overlineClasses = classNames("ps-text__style-controls__button", {
      "ps-text__style-controls__button_active":
        value.textDecoration === "line-through"
    })

    return (
      <div className="ps-text__style-controls">
        <div className={boldClasses} onClick={this.handleBold}>
          <svg
            width="10"
            height="12"
            viewBox="0 0 10 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.63 5.82C8.46 5.24 9 4.38 9 3.5C9 1.57 7.43 0 5.5 0H0V12H6.25C8.04 12 9.5 10.54 9.5 8.75C9.5 7.45 8.73 6.34 7.63 5.82ZM2.5 2H5.25C6.08 2 6.75 2.67 6.75 3.5C6.75 4.33 6.08 5 5.25 5H2.5V2ZM5.75 10H2.5V7H5.75C6.58 7 7.25 7.67 7.25 8.5C7.25 9.33 6.58 10 5.75 10Z"
              fill="#0085FF"
            />
          </svg>
        </div>
        <div className={italicClasses} onClick={this.handleItalic}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 0V2H6.58L2.92 10H0V12H8V10H5.42L9.08 2H12V0H4Z"
              fill="#0085FF"
            />
          </svg>
        </div>
        <div className={underlineClasses} onClick={this.handleUnderline}>
          <svg
            width="12"
            height="15"
            viewBox="0 0 12 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 0H1V6C1 7.32608 1.52678 8.59785 2.46447 9.53553C3.40215 10.4732 4.67392 11 6 11C7.32608 11 8.59785 10.4732 9.53553 9.53553C10.4732 8.59785 11 7.32608 11 6V0H9V6H9.0002C9.0002 6.7957 8.68411 7.55882 8.12146 8.12146C7.55882 8.68411 6.7957 9.0002 6 9.0002C5.2043 9.0002 4.44118 8.68411 3.87854 8.12146C3.31589 7.55882 2.9998 6.7957 2.9998 6L3 6V0ZM12 15V13H0V15H12Z"
              fill="#0085FF"
            />
          </svg>
        </div>
        <div className={overlineClasses} onClick={this.handleLineThrough}>
          <svg
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 13H7V9H5V13ZM1 0V2H5V5H7V2H11V0H1ZM0 8H12V6H0V8Z"
              fill="#0085FF"
            />
          </svg>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TextStyle)
