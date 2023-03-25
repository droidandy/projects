import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"

class TextAlign extends Component {
  update = (value) => {
    this.props.onChange(value)
  };

  classes = (align) => {
    return classNames("ps-text__align-controls__button", {
      "ps-text__align-controls__button_active": align === this.props.value
    })
  };

  render() {
    const { value } = this.props

    return (
      <div className="ps-text__align-controls">
        <div
          className={this.classes("left")}
          onClick={this.update.bind(null, "left")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 14H10V12H0V14ZM10 4H0V6H10V4ZM0 0V2H14V0H0ZM0 10H14V8H0V10Z"
              fill="#0085FF"
            />
          </svg>
        </div>
        <div
          className={this.classes("center")}
          onClick={this.update.bind(null, "center")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 12V14H12V12H2ZM2 4V6H12V4H2ZM0 10H14V8H0V10ZM0 0V2H14V0H0Z"
              fill="#0085FF"
            />
          </svg>
        </div>
        <div
          className={this.classes("right")}
          onClick={this.update.bind(null, "right")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 14H14V12H4V14ZM0 10H14V8H0V10ZM0 0V2H14V0H0ZM4 6H14V4H4V6Z"
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

export default connect(mapStateToProps, mapDispatchToProps)(TextAlign)
