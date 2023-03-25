import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import classNames from "classnames"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 410
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

class RulesConfirms extends Component {
  state = {
    saving: false
  };

  confirmButtonClassNames = () => {
    const { type } = this.props

    return classNames("button button_160 fr button_icon", {
      button_red: ["disable", "archive", "delete"].indexOf(type) > -1,
      button_green:
        ["unarchive", "enable", "trigger", "test", "duplicate", "save"].indexOf(
          type
        ) > -1
    })
  };

  cancelButtonClassNames = () => {
    const { type } = this.props

    return classNames("button button_160 fl", {
      button_red: type === "test",
      button_blue: type !== "test"
    })
  };

  onConfirm = () => {
    this.setState({ saving: true }, this.props.onConfirm)
  };

  render() {
    const {
      title,
      description,
      type,
      close,
      confirmButtonText,
      cancelButtonText,
      onConfirm,
      onCancel
    } = this.props

    const { saving } = this.state

    return (
      <Modal
        isOpen={true}
        onRequestClose={close}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Result modal"
      >
        <div style={{ padding: "20px 30px" }}>
          <div className="newapp-header__title">{title}</div>
          <div className="mt10">{description}</div>
          <div className="input-wrapper oh">
            <button
              className={this.cancelButtonClassNames()}
              onClick={() => {
                onCancel()
                close()
              }}
            >
              <span>{cancelButtonText}</span>
            </button>
            <button
              disabled={saving}
              className={this.confirmButtonClassNames()}
              onClick={this.onConfirm}
            >
              {type === "disable" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="3" y="3" width="10" height="10" fill="#FF0C46" />
                </svg>
              )}
              {type === "enable" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 14V2L12 8L4 14Z" fill="white" />
                </svg>
              )}
              {type === "trigger" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 1H3V5H7V7H3V15H1V1ZM9.13176 3.01949L8.13176 4.76949C8.04541 4.92058 8 5.0916 8 5.26562V10.6667C8 10.8831 7.92982 11.0936 7.8 11.2667L5.6 14.2001C5.35279 14.5297 5.58798 15.0001 6 15.0001H14C14.412 15.0001 14.6472 14.5297 14.4 14.2001L12.2 11.2667C12.0702 11.0936 12 10.8831 12 10.6667V5.26562C12 5.0916 11.9546 4.92058 11.8682 4.76949L10.8682 3.01949C10.4843 2.34767 9.51565 2.34767 9.13176 3.01949ZM11 6.00006C11 6.55235 10.5523 7.00006 10 7.00006C9.44771 7.00006 9 6.55235 9 6.00006C9 5.44778 9.44771 5.00006 10 5.00006C10.5523 5.00006 11 5.44778 11 6.00006Z"
                    fill="white"
                  />
                </svg>
              )}
              {type === "archive" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 2C0.895431 2 0 2.89543 0 4V5H16V4C16 2.89543 15.1046 2 14 2H2ZM1 6H15V12C15 13.1046 14.1046 14 13 14H3C1.89543 14 1 13.1046 1 12V6ZM5 8H11V9H5V8Z"
                    fill="white"
                  />
                </svg>
              )}
              {type === "unarchive" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 2C0.895431 2 0 2.89543 0 4V5H16V4C16 2.89543 15.1046 2 14 2H2ZM15 6H1V12C1 13.1046 1.89543 14 3 14H13C14.1046 14 15 13.1046 15 12V6ZM7 10V12H9V10H11L8 7L5 10H7Z"
                    fill="white"
                  />
                </svg>
              )}
              {type === "delete" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 2V1H6V2H2V4H14V2H10Z" fill="white" />
                  <path
                    d="M3 5V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V5H3ZM7.5 12.5H6V7.5H7.5V12.5ZM10 12.5H8.5V7.5H10V12.5Z"
                    fill="white"
                  />
                </svg>
              )}
              {type === "test" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9513 7.99936L9.81467 3.72603L7.93267 9.3727L4.65467 0.849365L1.97333 7.99936H0V9.99936H3.36L4.67867 6.48337L8.06733 15.2927L10.1853 8.93937L10.7153 9.99936H16V7.99936H11.9513Z"
                    fill="white"
                  />
                </svg>
              )}
              {type === "duplicate" && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.5 1C3.11929 1 2 2.11929 2 3.5V11.5H3V3.5C3 2.67157 3.67157 2 4.5 2H11.5V1H4.5ZM6 3C4.89543 3 4 3.89543 4 5V13C4 14.1046 4.89543 15 6 15H12C13.1046 15 14 14.1046 14 13V5C14 3.89543 13.1046 3 12 3H6Z"
                    fill="#FFFFFF"
                  />
                </svg>
              )}
              <span>{saving ? "Loading..." : confirmButtonText}</span>
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(RulesConfirms)
